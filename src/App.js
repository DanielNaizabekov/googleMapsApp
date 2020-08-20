/* eslint-disable no-undef */
import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import MapSearchInput from './components/MapSearchInput/MapSearchInput';

function App() {
  const [markers, setMarkers] = useState([]);

  const markersHandler = (id, coords) => {
    const newMarkers = [...markers];
    const changingMarkerIndex = newMarkers.findIndex(item => item.id === id);
    newMarkers[changingMarkerIndex].position = coords;
    setMarkers(newMarkers);
  };
  const dragEndHandler = (id, coords) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({location: coords}, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            const newMarkers = [...markers];
            const changingMarkerIndex = newMarkers.findIndex(item => item.id === id);
            newMarkers[changingMarkerIndex].address = results[0].formatted_address;
            setMarkers(newMarkers);
          } else {
            window.alert("No results found");
          }
        }
      }
    );
  };

  const mapSearchSubmitHandler = ({ address, position }) => {
    const newMarker = {
      address,
      position,
      id: Date.now().toString(),
    };
    setMarkers(markers => [...markers, newMarker]);
  };

  return (
    <div>
      <MapComponent
        markers={markers}
        onPositionChanged={markersHandler}
        onDragEnd={dragEndHandler}
      />

      <MapSearchInput onPlaceChanged={mapSearchSubmitHandler}/>
    </div>
  );
}

export default App;
