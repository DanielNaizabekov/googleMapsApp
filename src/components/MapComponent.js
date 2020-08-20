import React from 'react';
import './MapComponent.css';
import { compose, withProps, lifecycle } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';

const API_KEY = 'AIzaSyD30y0pPfIYSZlD_9a3ts0_QmNqDWeEFt0';
const MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;

const MapComponent = compose(
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
        center: {
          lat: 41.9, lng: -87.624,
        },
        onMarkerMounted: ref => {
          refs.markers = [...refs.markers, ref];
        },
        getCoords: index => {
          return {
            lat: refs.markers[index].getPosition().lat(),
            lng: refs.markers[index].getPosition().lng(),
          };
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const emitPositionChanged = (id, index) => {
    const coords = props.getCoords(index);
    props.onPositionChanged(id, coords);
  };
  const emitDragEnd = (id, index) => {
    const coords = props.getCoords(index);
    props.onDragEnd(id, coords);
  };

  return (
    <div>
      <GoogleMap
        defaultZoom={8}
        center={props.center}
      >
        {props.markers.map((mark, index) => (
          <Marker
            draggable={true}
            position={mark.position}
            onPositionChanged={() => emitPositionChanged(mark.id, index)}
            onDragEnd={() => emitDragEnd(mark.id, index)}
            ref={props.onMarkerMounted}
            key={mark.id}
          />
        ))}
        <Polyline
          path={props.markers.map(item => item.position)}
          geodesic={true}
          options={{
            strokeColor: "#ff2527",
            strokeOpacity: 0.75,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </div>
  );
});

export default MapComponent;