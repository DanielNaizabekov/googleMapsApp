import React from 'react';
import './Map.css';
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from 'react-google-maps';
import { MAP_URL } from '../../api/urls';

const Map = compose(
  withProps({
    googleMapURL: MAP_URL,
    containerElement: <div className="container-element" />,
    mapElement: <div className="map-element" />,
    loadingElement: <div className="loading-element" />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {
        markers: [],
      };

      this.setState({
        openingMarkerId: null,
        onMarkerMounted: (ref, index) => refs.markers[index] = ref,
        getMarkerCoords: index => ({
          lat: refs.markers[index].getPosition().lat(),
          lng: refs.markers[index].getPosition().lng(),
        }),
        onOpenBox: id => this.setState({ openingMarkerId: id }),
        onCloseBox: () => this.setState({ openingMarkerId: null }),
      });
    },
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  return (
    <GoogleMap
      defaultZoom={8}
      center={props.center}
    >
      {props.markers.map((marker, index) => (
        <Marker
          draggable={true}
          position={marker.coords}
          onPositionChanged={() => props.onMarkerPositionChanged(index, props.getMarkerCoords(index))}
          onDragEnd={() => props.onMarkerDragEnd(index, props.getMarkerCoords(index))}
          onClick={() => props.onOpenBox(marker.id)}
          ref={event => props.onMarkerMounted(event, index)}
          key={marker.id}
        >
          {props.openingMarkerId === marker.id &&
            <InfoWindow onCloseClick={props.onCloseBox}>
              <div>{marker.address}</div>
            </InfoWindow>}
        </Marker>
      ))}
      <Polyline
        path={props.markers.map(marker => marker.coords)}
        geodesic={true}
        options={{
          strokeColor: "#ff2527",
          strokeOpacity: 0.75,
          strokeWeight: 2,
        }}
      />
    </GoogleMap>
  );
});

export default Map;