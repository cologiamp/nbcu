// this is the Map component for React!
// import some dependencies
var React = require('react');
var ReactDOM = require('react-dom');
var L = require('leaflet');
//require('leaflet/dist/leaflet.css');

// using webpack json loader we can import our geojson file like this
var geojson = require('json!./usa_airports.geojson');

/*
var xmlhttp = new XMLHttpRequest();
var url = "http://localhost/usa_airports.json";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var arr = JSON.parse(this.responseText);
//        myFunction(arr);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

function myFunction(arr) {
  var geojson = arr;
}

console.log(geojson);
*/


// import our subway line filter component
var Filter = require('./Filter');

// import our "Fork Me On Github" link component
//var ForkMe = require('./ForkMe');

// let's store the map configuration properties,
// we could also move this to a separate file & require it...
var config = {};

// an array to store BK subway lines
var tmpSubwayLines = [];
// tmp array used to eventually create the above array
var subwayLines = [];

// map paramaters to pass to L.map when we instantiate it
config.params = {
  center: [38.68,-96.50], //Greenpoint
  zoomControl: false,
  zoom: 4,
  maxZoom: 19,
  minZoom: 0,
  scrollwheel: false,
  legends: true,
  infoControl: false,
  attributionControl: true
};

// params for the L.tileLayer (aka basemap)
config.tileLayer = {
  uri: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  params: {
    minZoom: 0,
    attribution: '',
    id: '',
    accessToken: ''
  }
};

// here's the actual component
var Map = React.createClass({
  getInitialState: function() {
    // TODO: if we wanted an initial "state" for our map component we could add it here
    return {
      tileLayer : null,
      geojsonLayer: null,
      geojson: null,
      filter: '*',
      numEntrances: null,
    };
  },

  // a variable to store our instance of L.map
  map: null,

  componentWillMount: function() {
    // code to run just before adding the map
  },

  componentDidMount: function() {
    // code to run just after the component "mounts" / DOM elements are created
    // make the AJAX request for the GeoJSON data
    this.getData();
    // create the Leaflet map object
    if (!this.map) this.init(this.getID());
  },

  componentDidUpdate(prevProps, prevState) {
    // code to run when the component receives new props or state
    // check to see if geojson is stored, map is created, and geojson overlay needs to be added
    if (this.state.geojson && this.map && !this.state.geojsonLayer) {
      // add the geojson overlay
      this.addGeoJSONLayer(this.state.geojson);
    }

    // check to see if the subway lines filter has changed
    if (this.state.filter !== prevState.filter) {
      // filter / re-render the geojson overlay
      this.filterGeoJSONLayer();
    }
  },

  componentWillUnmount: function() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
    this.map.remove();
  },

  updateMap: function(subwayLine) {
    // change the subway line filter
    if (subwayLine === "All lines") {
      subwayLine = "*";
    }
    // update our state with the new filter value
    this.setState({
      filter: subwayLine
    });
  },

  getData: function() {
		this.setState({
			numEntrances: geojson.features.length,
			geojson: geojson
		});
  },

  addGeoJSONLayer: function(geojson) {
    // create a native Leaflet GeoJSON SVG Layer to add as an interactive overlay to the map
    // an options object is passed to define functions for customizing the layer
    var geojsonLayer = L.geoJson(geojson, {
      pointToLayer: this.pointToLayer
    });
    // add our GeoJSON layer to the Leaflet map object
    geojsonLayer.addTo(this.map);
    // store the Leaflet GeoJSON layer in our component state for use later
    this.setState({ geojsonLayer: geojsonLayer });
    // fit the geographic extent of the GeoJSON layer within the map's bounds / viewport
    this.zoomToFeature(geojsonLayer);
  },

  filterGeoJSONLayer: function() {
    // clear the geojson layer of its old data
    this.state.geojsonLayer.clearLayers();
    // create the new geojson layer with a filter function
    var geojsonLayer = L.geoJson(this.state.geojson, {
      pointToLayer: this.pointToLayer,
      //filter: this.filter
    });
    // add the new geojson layer to the map
    geojsonLayer.addTo(this.map);
    // update the component state with the new geojson layer
    this.setState({geojsonLayer: geojsonLayer});
    // fit the map to the new geojson layer's geographic extent
    this.zoomToFeature(geojsonLayer);
  },

  zoomToFeature: function(target) {
    // pad fitBounds() so features aren't hidden under the Filter UI element
    var fitBoundsParams = {
      paddingTopLeft: [200,10],
      paddingBottomRight: [10,10]
    };
    // set the map's center & zoom so that it fits the geographic extent of the layer
    //this.map.fitBounds(target.getBounds(), fitBoundsParams);
  },

  filter: function(feature, layer) {
    // filter the subway entrances based on the map's current search filter
    // returns true only if the filter value matches the value of feature.properties.LINE
    var test = feature.properties.LINE.split('-').indexOf(this.state.filter);

    if (this.state.filter === '*' || test !== -1) {
      return true;
    }
  },

  pointToLayer: function(feature, latlng) {
    // renders our GeoJSON points as circle markers, rather than Leaflet's default image markers

    // parameters to style the GeoJSON markers
    var markerParams = {
      radius: 4,
      fillColor: 'orange',
      color: '#fff',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.8
    };

    return L.circleMarker(latlng, markerParams);
  },

  onEachFeature: function(feature, layer) {
    // this method is used to create popups for the GeoJSON features
    // it also creates the initial array of unique subway line names which is later passed to the Filter component

    if (feature.properties && feature.properties.NAME && feature.properties.LINE) {
      // if the array for unique subway line names has not been made, create it
      if (subwayLines.length === 0) {
        // add subway line names to a temporary subway lines array
        feature.properties.LINE.split('-').forEach(function(line, index){
          tmpSubwayLines.push(line);
        });

        // on the last GeoJSON feature make a new array of unique values from the temporary array
        if (this.state.geojson.features.indexOf(feature) === this.state.numEntrances - 1) {
          // use filter() to make sure the subway line names array has one value for each subway line
          // use sort() to put our values in numeric and alphabetical order
          subwayLines = tmpSubwayLines.filter(function(value, index, self){
            return self.indexOf(value) === index;
          }).sort();
          // finally add a value to represent all of the subway lines
          subwayLines.unshift('All lines');
        }
      }

      // assemble the HTML for the markers' popups
      var popupContent = '<h3>' + feature.properties.NAME +
                         '</h3><strong>Access to MTA lines:</strong> ' +
                         feature.properties.LINE;
      // add our popups
      layer.bindPopup(popupContent);
    }
  },

  getID: function() {
    // get the "id" attribute of our component's DOM node
    return ReactDOM.findDOMNode(this).querySelectorAll('#map')[0];
  },

  init: function(id) {
    if (this.map) return;
    // this function creates the Leaflet map object and is called after the Map component mounts
    this.map = L.map(id, config.params);
    L.control.zoom({ position: "bottomleft"}).addTo(this.map);
    L.control.scale({ position: "bottomleft"}).addTo(this.map);

    // a TileLayer is used as the "basemap"
    var tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(this.map);

    // set our state to include the tile layer
    this.setState({
      tileLayer: tileLayer
    });
  },

  render : function() {
    // return our JSX that is rendered to the DOM
    // we pass our Filter component props such as subwayLines array, filter & updateMap methods
    //console.log(config.params);
    return (
      <div id="mapUI">
        <div id="map" />
      </div>
    );
  }
});

// export our Map component so that Browserify can include it with other components that require it
module.exports = Map;
