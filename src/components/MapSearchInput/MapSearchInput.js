import React from 'react';
import './MapSearchInput.css';
import { compose, lifecycle } from 'recompose';

const MapSearchInput = compose(
  lifecycle({
    componentWillMount() {
      let input;

      this.setState({
        initAutocomplete: (event, emitPlaceChanged) => {
          try {
            if(input) return;
            event.persist();
            // eslint-disable-next-line no-undef
            input = new google.maps.places.Autocomplete(event.target);
            input.addListener('place_changed', () => {
              const getPlaceResult = input.getPlace();
              const place = {
                address: getPlaceResult.formatted_address,
                position: {
                  lat: getPlaceResult.geometry.location.lat(),
                  lng: getPlaceResult.geometry.location.lng(),
                },
              };
              emitPlaceChanged(place);
            });
          } catch {
            console.log('Google maps is loading');
          }
        },
      });
    },
  })
)(props => {
  return (
    <div className="map-search-wrap">
      <input
        className="map-search-input"
        type="text"
        placeholder="Search place"
        onClick={(event) => props.initAutocomplete(event, props.onPlaceChanged)}
      />
    </div>
  );
});

export default MapSearchInput;