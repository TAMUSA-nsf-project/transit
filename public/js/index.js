const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const stopNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let stopIndex = 0;
let labelIndex = 0;
var markers = [];
var user_markers = [];
var path = [];
var circles = [];
// var allStops;
var DBresult;
var allRoutes = {};
const allRouteNames = new Set();
var route1 = [];
var route2 = [];

/*
    An InfoWindow used to display a stop's address, number, assigned bus,
    and next arrival time when user left clicks on it.
    Because we only need one bus point to show at any given time,
    we only need one InfoWindow to be shared across all stops.
*/
let stopInfoWindow;

let map;
let poly;
let directionsService;
let directionsRenderer;
var bounds;

function initMap() {
  /**
   // get the programmed stops
   * 
   * //TODO:
   * - [*]reconfigure functionality to load only stops in proximity to user
   * - [x]give each stop 'clickable' function
   * - [x]define more than one route
   * - []make stop onclick() display all routes associated with stop
   * - []color routes to differentiate
   * - []display information to user in a better way
   */
  
  const tamusa = new google.maps.LatLng(29.30428893171069, -98.52470397949219);
  var mapOptions = {
    // Centered on Tamusa
    center: tamusa,
    zoom: 13,
  }

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  // get all the data from DB and then go from there
  fetch('/stops')         // changed for any server
    .then(function (resp) {
      // console.log(resp);
      return resp.json();
    })
    .then(function (sent) {
      // allStops = sent.data.stops;
      // allStops = sent.data.routes;
      DBresult = sent.data;
      console.log(DBresult);
      // console.log(sent.data.stops);
      // console.log(sent.data.routes);

      var dropdownOptions = "";

      for (var key in DBresult[0]) {
        console.log(key);
        dropdownOptions += "<li><button id='" + key + "' class='dropdown-item' type='button'>" + key + "</button></li>";
        // var routeName = Object.getOwnPropertyNames(DBresult[x]);
        // var routeName = keys;
        // var stops = Object.values(DBresult[x]);
        // var myObj = [];
        // routeName.forEach(element => {
        //   allRouteNames.add(element); // adds unique route name to set   
        // });
      }

      console.log(allRouteNames);

      for (var route of allRouteNames.values()) {
        // Populate origin dropdown list
        // console.log(route);
      }

      document.getElementById("origin-input-dropdown").innerHTML = dropdownOptions;

      const container = document.querySelector('#origin-input-dropdown');

      // Click handler for entire dropdown menu
      container.addEventListener('click', function (e) {
        // But only call function for elements added dynamically
        if (e.target.classList.contains('dropdown-item')) {
          if (directionsRenderer != null) {
            directionsRenderer.setMap(null);
            directionsRenderer = null;
          }
          calcRouteSelect(e.target.innerHTML);
          calcRouteTest(e.target.innerHTML);
          console.log(e.target.innerHTML);
        }
      });

      new AutocompleteDirectionsHandler(map);

      // needed for drawing line but not used
      poly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 3,
      });

      // This event listener calls addMarker() when the map is clicked.
      google.maps.event.addListener(map, "rightclick", (event) => {
        console.log(event);
        // addMarker(event.latLng);
        // addLatLngToPoly(event.latLng, poly);   // fun to draw line on the map
        // addStop();
      });

      // google.maps.event.addListener(map, "click", (event) => {
      //   // addCircle(event.latLng, infoWindow);
      //   // console.log(event.latLng);
      // });

      // Add a specific "tamusa" marker at the center of the map.
      new google.maps.Marker({
        position: tamusa,
        label: "Tamusa",
        map: map,
      });

      // Create an info window to share between markers.
      const infoWindow = new google.maps.InfoWindow();
      stopInfoWindow = new google.maps.InfoWindow();

      for (let route in allRoutes) {
        //sorts the stops along route based on data definition... Might be a better way to do this from original DB query
        allRoutes[route].sort((a, b) => a.routes[route] - b.routes[route]);

        // Create the markers.
        for (var i = 0; i < allRoutes[route].length; i++) {
          var data = allRoutes[route][i];
          var label = JSON.stringify(data.routes);
          console.log('label=', label);
          // console.log(allStops[i]);
          var myLatlng = new google.maps.LatLng(data.lat, data.lng);
          // if(data.routes.length() > 1)
          const marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            label: `${i + 1}`,
            // label: label,
            title: data.title,
            optimized: false,
            visible: false,
          });

          // Add a click listener for each marker, and set up the info window.
          marker.addListener("click", () => {
            infoWindow.close();
            // infoWindow.setContent(marker.getTitle());
            infoWindow.setContent(`<h3>${marker.getTitle()}</h3>`);
            infoWindow.open(marker.getMap(), marker);
            // gives each marker the ability to call calcRoute() for stops along routes specific marker is associated with
            calcRoute(route)
          });

          // add marker to markers array
          markers.push(marker);
        }
        // *information purposes*
        console.log(markers);
        console.log(data.routes);
      }


      // temporary way of giving user ability to see bus route
      const routeButton = document.createElement("button");
      routeButton.textContent = "Show Route";
      routeButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(routeButton);
      routeButton.addEventListener("click", () => {
        // calls calcRoute for every stop returned from DB... *experimental*
        calcRouteTest();
      })


      const locationButton = document.createElement("button");

      locationButton.textContent = "Pan to Current Location";
      locationButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = { // use this position for radius search
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              // console.log(pos);  *prints*  Object { lat: 2*.******, lng: -9*.******* }
              infoWindow.setPosition(pos);
              infoWindow.setContent("Here I am!");
              infoWindow.open(map);
              map.setCenter(pos);
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter());
            }
          );
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      });

    })

  class AutocompleteDirectionsHandler {
    map;
    originPlaceId;
    destinationPlaceId;
    travelMode;
    directionsService;
    directionsRenderer;
    constructor(map) {
      this.map = map;
      this.originPlaceId = "";
      this.destinationPlaceId = "";
      this.travelMode = google.maps.TravelMode.WALKING;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(map);

      // const originInput = document.getElementById("origin-input");
      const originInput = document.getElementById("origin-input");
      const originInputContainer = document.getElementById("origin-input-container");
      const destinationInput = document.getElementById("destination-input");
      const modeSelector = document.getElementById("mode-selector");
      // const originAutocomplete = new google.maps.places.Autocomplete(originInput);

      // Specify just the place data fields that you need.
      // originAutocomplete.setFields(["place_id"]);

      // const destinationAutocomplete = new google.maps.places.Autocomplete(
      //   destinationInput
      // );

      // Specify just the place data fields that you need.
      // destinationAutocomplete.setFields(["place_id"]);
      this.setupClickListener(
        "changemode-walking",
        google.maps.TravelMode.WALKING
      );
      this.setupClickListener(
        "changemode-transit",
        google.maps.TravelMode.TRANSIT
      );
      this.setupClickListener(
        "changemode-driving",
        google.maps.TravelMode.DRIVING
      );
      // this.setupPlaceChangedListener(originAutocomplete, "ORIG");
      // this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
      // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInputContainer);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        destinationInput
      );
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    setupClickListener(id, mode) {
      const radioButton = document.getElementById(id);

      radioButton.addEventListener("click", () => {
        this.travelMode = mode;
        this.route();
      });
    }
    setupPlaceChangedListener(autocomplete, mode) {
      autocomplete.bindTo("bounds", this.map);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.place_id) {
          window.alert("Please select an option from the dropdown list.");
          return;
        }

        if (mode === "ORIG") {
          this.originPlaceId = place.place_id;
        } else {
          this.destinationPlaceId = place.place_id;
        }

        this.route();
      });
    }
    route() {
      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }

      const me = this;

      this.directionsService.route(
        {
          origin: { placeId: this.originPlaceId },
          destination: { placeId: this.destinationPlaceId },
          travelMode: this.travelMode,
        },
        (response, status) => {
          if (status === "OK") {
            me.directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }
  }
  // add event listeners for the buttons
  document
    .getElementById("show-markers")
    .addEventListener("click", showMarkers);
  document
    .getElementById("hide-markers")
    .addEventListener("click", hideMarkers);
  document
    .getElementById("delete-markers")
    .addEventListener("click", deleteMarkers);

  /**
   * Sets the map on all markers in the array.
   */
  function setMapOnAll(map) {
    for (let i = 0; i < user_markers.length; i++) {
      user_markers[i].setMap(map);
    }
    for (let i = 0; i < circles.length; i++) {
      circles[i].setMap(map);
    }
    if (map == null) {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
      }
    }

  }


  /** 
   * Removes the markers from the map, but keeps them in the array.
   */
  function hideMarkers() {
    setMapOnAll(null);
    poly.setMap(null);
  }

  /** 
   * Shows any markers currently in the array.
   */
  function showMarkers() {
    setMapOnAll(map);
    poly.setMap(map);
  }

  /**
   * Deletes all markers in the array by removing references to them.
   */
  function deleteMarkers() {
    hideMarkers();
    user_markers = [];
    labelIndex = 0;
    poly.setPath([]);
    path = poly.getPath();
    // poly.setMap(null);
    // console.log(path);
  }
}

/**
 * function to draw a circle on the map
 * @param {*} center google.maps.LatLng() object
 */
function addCircle(center) {
  console.log(JSON.stringify(center));
  circle = new google.maps.Circle({
    map: map, //The existing map
    center: center,
    radius: 2000 // 2K radius
  });
  if (circles.length == 0) {
    circles.push(circle);
  } else {
    circles[0].setMap(null);
    circles[0] = circle;
  }

  // loop throug bus stops
  for (var i = 0; i < this.markers.length; i++) {
    var marker = this.markers[i];
    var distance = google.maps.geometry.spherical.computeDistanceBetween(marker.getPosition(), center);
    if (distance < 2000) {
      // Markers within 2km radius should populate
      marker.setVisible(true);
    } else {
      // console.log(marker);
      marker.setVisible(false);
    }
  }
}

/**
 * Function calculates and draws route for routes selected from dropdown menu
 *  - Need to figure better way to draw routes (too many waypoints)
 *  - Researching breaking the route up (how to draw if multiple route 'chunks')
 *  - Researching using the polyline from directionsService response
 *  @param {String} route the route's name
 */
function calcRouteSelect(route) {
  console.log(route);
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  var len = DBresult[0][route].length - 1;
  var origin = new google.maps.LatLng(DBresult[0][route][0].Lat, DBresult[0][route][0].Lng);
  var dest = new google.maps.LatLng(DBresult[0][route][len].Lat, DBresult[0][route][len].Lng);

  var waypoints = [];
  for (var i = 1; i < len; i++) {
    console.log(DBresult[0][route][i])
    waypoints.push({
      location: new google.maps.LatLng(DBresult[0][route][i].Lat, DBresult[0][route][i].Lng),
      stopover: false
    })
  }
  
  var request = {
    origin: origin,
    destination: dest,
    waypoints: waypoints,
    provideRouteAlternatives: false,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  
  console.log(request);
  directionsService.route(request, function (response, status) {
    if (status == 'OK') {
      console.log("Polyline Overview: ", response.routes[0]);
      console.log(status);

      directionsRenderer.setDirections(response);
    }
    else {
      console.log(status, response);
    }
  });
}

/**
 * Turned this into a test fuction for drawing more hardcoded routes.  The map now attempt to draw the route with this fuction
 * and with 'calcRouteSelect(route)'.  This function works and the other function works sometimes.  Both will be drawn in the
 * case of the other fuction's success.  
 * @param {String} route the route's name
 */
function calcRouteTest(route) {
  // clear all previous markers
  user_markers = [];

  // call fuction to add Markers to each stop
  calcMarkers(route);

  var cur = 1;
  var testLen = DBresult[0][route].length;
  var trip = DBresult[0][route];
  var div = 9;
  path = []
  bounds = new google.maps.LatLngBounds();
  // console.log(trip);  

  /**
   * Recursive function to build poly line based on incremental directionsSevices API calls
   * @returns 
   */
  function build() {
    if (!trip[cur] || !trip[div]) {
      // build map
      poly.setPath(path);
      map.fitBounds(bounds);
      return;
    }
  
    var waypoints = [];
    for (var i = cur; i < div; i++) {
      // console.log(DBresult[0][route][i])
      waypoints.push({
        location: new google.maps.LatLng(trip[i].Lat, trip[i].Lng),
        stopover: false
      })
      bounds.extend(new google.maps.LatLng(trip[i].Lat, trip[i].Lng));
    }
  
    directionsService.route({
      origin: new google.maps.LatLng(trip[cur-1].Lat, trip[cur-1].Lng),
      destination: new google.maps.LatLng(trip[div].Lat, trip[div].Lng),
      waypoints: waypoints,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    },
      function (result, status) {
        console.log(result);
        if (status == google.maps.DirectionsStatus.OK) {
          for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
            // console.log(JSON.stringify(result.routes[0].overview_path[i]));
  
            path.push(result.routes[0].overview_path[i]);
          }
        } else {
          path.push(new google.maps.LatLng(trip[cur].Lat, trip[cur].Lng));
        }
  
        // make sure every stop is included
        if( div + 1 == testLen - 1){
          cur = testLen - 2;
          div = testLen - 1;
          console.log("Current start/stop index: ", cur, div);
        } else if ((div + 9 >= testLen - 1) && (div + 1 <= testLen -2) ) {
          cur = div +1;
          div = testLen -1;
          console.log("Current start/stop index: ", cur, div );
        } else {
          cur = div + 1;
          div = cur + 8;
          console.log("Current start/stop index: ", cur, div );
        }
        build();
      });
  }
  
  // console.log(trip[0].Lat, trip[0].Lng);
  bounds.extend(new google.maps.LatLng(trip[0].Lat, trip[0].Lng));
  build();
  
  poly.setMap(map);
  
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

/**
 * fuction to extract data for marker/infoWindow then call addMarker()
 * @param {String} route 
 */
function calcMarkers(route){
  DBresult[0][route].forEach(element => {
    console.log(element);
    var location = new google.maps.LatLng(element.Lat, element.Lng);
    var title = element["Stop Name"];
    var stopNum = element["Stop Number"];
    var routeName = element.route;
    var seq = String(element["Order on Route"]);
    console.log(location, title, stopNum, routeName, seq);
    addMarker(location, title, stopNum, routeName, seq);
  });
}

/**
 * function to create a clickable marker (and resulting infoWindow) for each stop along selected route
 * @param {Object} location 
 * @param {String} title 
 * @param {Number} stopNum 
 * @param {String} routeName 
 * @param {String} seq 
 */
function addMarker(location, title, stopNum, routeName, seq) {
  console.log(JSON.stringify(location));

  const newMarker = new google.maps.Marker({
    position: location,
    label: seq,
    title: JSON.stringify(location),
    map: map,
  })

  // Temporary string just to see the layout until I can get stop data to work on my end. - Emmer
  const testContentString = `<div style='margin-bottom:-10px'><strong><b>${title}</b></strong></div><br>` +
    `Stop #: ${stopNum}<br>` +
    `Route: ${routeName}<br>` +
    "Next arrival at 11:59 PM";

  newMarker.addListener("click", () => {

    stopInfoWindow.setContent( testContentString );
    stopInfoWindow.open( map, newMarker );

  });

  user_markers.push( newMarker );

}

// not really using at the moment, but it is fun
function addLatLngToPoly(latLng, poly) {
  path = poly.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear
  path.push(latLng);

  // Update the text field to display the polyline encodings
  const encodeString = google.maps.geometry.encoding.encodePath(path);

  if (encodeString) {
    // document.getElementById("encoded-polyline").value = encodeString;
    // console.log(encodeString);
    // console.log(path);
  }
}
