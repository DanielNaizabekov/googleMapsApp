import React, { useState } from 'react';
import './MapPage.css';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import Map from '../../components/Map/Map';
import MapSearchInput from '../../components/MapSearchInput/MapSearchInput';

function MapPage() {
  const [markers, setMarkers] = useState([]);
  const BISHKEK = { lat: 42.882, lng: 74.582 };
  const [mapCenter, setMapCenter] = useState(BISHKEK);

  const addMarker = ({ address, coords }) => {
    const newMarker = {
      address,
      coords,
      id: Date.now().toString(),
    };
    setMapCenter(coords);
    setMarkers(markers => [...markers, newMarker]);
  };

  const updateMarkerCoords = (index, coords) => {
    const prevMarkers = [...markers];
    prevMarkers[index].coords = coords;
    setMarkers(prevMarkers);
  };

  let geocoder;
  const updateMarkerAddress = (index, coords) => {
    try {
      // eslint-disable-next-line no-undef
      !geocoder && ( geocoder = new google.maps.Geocoder() );
  
      geocoder.geocode({location: coords}, (results, status) => {
          if (status === "OK" && results[0]) {
              const prevMarkers = [...markers];
              prevMarkers[index].address = results[0].formatted_address;
              setMarkers(prevMarkers);
          } else {
            alert('Place not found');
          }
        }
      );
    } catch {
      console.log('Google maps is loading');
    }
  };

  const removeMarker = removingMarker => {
    const newMarkers = [...markers];
    const removingMarkerIndex = newMarkers.findIndex(marker => marker.id === removingMarker.id);
    newMarkers.splice(removingMarkerIndex, 1);
    setMarkers(newMarkers);
  };
  const moveMarker = ({ oldIndex, newIndex }) => {
    let newMarkers = [...markers];
    const movingMarker = newMarkers.splice(oldIndex, 1)[0];
    newMarkers.splice(newIndex, 0, movingMarker);
    setMarkers(newMarkers);
  };
  const PlacesItemHandle = SortableHandle( () => (
    <div className="map-page-places-item-handle" />
  ) );
  const PlacesItem = SortableElement( ({ value: marker }) => (
    <li onClick={() => setMapCenter(marker.coords)} className="map-page-places-item">
      <span className="map-page-places-item-text">{ marker.address }</span>
      <PlacesItemHandle />
      <div className="close-icon" onClick={() => removeMarker(marker)} />
    </li>
  ) );
  const PlacesList = SortableContainer( ({ items: markers }) => (
    <ul className="map-page-places-list">
      {markers.map((marker, index) => (
        <PlacesItem key={marker.id} index={index} value={marker}/>
      ))}
    </ul>
  ) );

  return (
    <div className="map-page">
      <div className="map-page-left">
        <MapSearchInput onPlaceChanged={addMarker}/>

        {markers.length
          ? <PlacesList items={markers} onSortEnd={moveMarker} useDragHandle helperClass="active"/>
          : <h3 className="map-page-title">The list is empty</h3>}
      </div>

      <div className="map-page-right">
        <Map
          center={mapCenter}
          markers={markers}
          onMarkerPositionChanged={updateMarkerCoords}
          onMarkerDragEnd={updateMarkerAddress}
        />
      </div>
    </div>
  );
};

export default MapPage;