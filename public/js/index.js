const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const stopNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let stopIndex = 0;
let labelIndex = 0;
var markers = [];
var user_markers = [];
let path;
var circles = [];
var allStops;
var allRoutes = {};
const allRouteNames = new Set();
var route1 = [];
var route2 = [];

let map;
let poly;

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
  // get all the data from DB and then go from there
  fetch('/stops')         // changed for any server
    .then(function (resp) {
      // console.log(resp);
      return resp.json();
    })
    .then(function (sent) {
      // allStops = sent.data.stops;
      allStops = sent.data.routes;
      // console.log(sent.data.stops);
      // console.log(sent.data.routes);


      for (var x in allStops) {
        /**
         * sets the amount of routes to include based on object's data
         */
        // console.log(Object.getOwnPropertyNames(allRoutes[x].routes));
        var routeName = Object.getOwnPropertyNames(allStops[x].routes);
        routeName.forEach(element => {
          allRouteNames.add(element);

        });
      }
      console.log(allRouteNames);

      for (var route of allRouteNames.values()) {
        console.log(route)
        allRoutes[route] = [];
        for (var stop of allStops) {
          /**
           * Gathers all stops defined in each route
           */

          if (Object.hasOwn(stop.routes, route)) {
            allRoutes[route].push(stop);
            // console.log(allRoutes[x].routes.r1);
          }
        }
      }

      console.log(allRoutes);
      // if(Object.hasOwn(allRoutes[x].routes, "r2")){
      //   route2.push(allRoutes[x]);
      //   // console.log(allRoutes[x].routes);
      // }

      // console.log(allRoutes);
      // console.log(route1.sort((a, b) => a.routes.r2 - b.routes.r2));
      // console.log(route2.sort((a, b) => a.routes.r2 - b.routes.r2));
      // console.log(route2.sort({(route2[a].routes.r2, route2[b].routes.r2): 1 } ));
      // route2 = sent.data.routes.routes.r2
      // console.log(route1);
      // console.log(JSON.stringify(route2));
      // allRoutes.forEach(element => {
      // console.log(element.title)

      // });


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
      new AutocompleteDirectionsHandler(map);

      // needed for drawing line but not used
      poly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: 3,
      });

      // This event listener calls addMarker() when the map is clicked.
      google.maps.event.addListener(map, "rightclick", (event) => {
        addMarker(event.latLng);
        addLatLngToPoly(event.latLng, poly);   // fun to draw line on the map
      });

      google.maps.event.addListener(map, "click", (event) => {
        addCircle(event.latLng, infoWindow);
        // console.log(event.latLng);    
      });

      // Add a specific "tamusa" marker at the center of the map.
      new google.maps.Marker({
        position: tamusa,
        label: "Tamusa",
        map: map,
      });

      // Create an info window to share between markers.
      const infoWindow = new google.maps.InfoWindow();

      for (let route in allRoutes) {
        //sorts the stops along route based on data definition... Might be a better way to do this from original DB query
        allRoutes[route].sort((a, b) => a.routes.r2 - b.routes.r2);

        console.log('label=', label)
        // Create the markers.
        for (var i = 0; i < allRoutes[route].length; i++) {
          var data = allRoutes[route][i];
          var label = JSON.stringify(data.routes);
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
      routeButton.textContent = "see bus route";
      routeButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(routeButton);
      routeButton.addEventListener("click", () => {
        // calls calcRoute for every stop returned from DB... *experimental*
        calcRouteAll();
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

      const originInput = document.getElementById("origin-input");
      const destinationInput = document.getElementById("destination-input");
      const modeSelector = document.getElementById("mode-selector");
      const originAutocomplete = new google.maps.places.Autocomplete(originInput);

      // Specify just the place data fields that you need.
      originAutocomplete.setFields(["place_id"]);

      const destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput
      );

      // Specify just the place data fields that you need.
      destinationAutocomplete.setFields(["place_id"]);
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
      this.setupPlaceChangedListener(originAutocomplete, "ORIG");
      this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
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
  };
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

  // Sets the map on all markers in the array.
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

  // Removes the markers from the map, but keeps them in the array.
  function hideMarkers() {
    setMapOnAll(null);
    poly.setMap(null);
  }

  // Shows any markers currently in the array.
  function showMarkers() {
    setMapOnAll(map);
    poly.setMap(map);
  }

  // Deletes all markers in the array by removing references to them.
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

function calcRouteAll() {
  /**
   * Function calculates and draws route for every stop that was returned from the DB query 
   */
  var origin = new google.maps.LatLng(allStops[0].lat, allStops[0].lng);
  var dest = new google.maps.LatLng(allStops[0].lat, allStops[0].lng);

  var waypoints = [];
  for (var i = 1; i < allStops.length; i++) {
    waypoints.push({
      location: new google.maps.LatLng(allStops[i].lat, allStops[i].lng),
      stopover: false
    })
    
  }

  var selectedMode = "Driving"
  var request = {
    origin: origin,
    destination: dest,
    travelMode: google.maps.TravelMode[selectedMode],
    waypoints: waypoints,
    provideRouteAlternatives: false,
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  directionsService.route(request, function (response, status) {
    if (status == 'OK') {
      console.log(response);
      console.log(status);

      directionsRenderer.setDirections(response);
    }
  });
}

function calcRoute(route) {
  /**
   * Function calculates and draws route based on specific route which is local to data definition of stop
   */
  // for(let route in routes){
    console.log("route = ", route);

    var origin = new google.maps.LatLng(allRoutes[route][0].lat, allRoutes[route][0].lng);
    var dest = new google.maps.LatLng(allRoutes[route][0].lat, allRoutes[route][0].lng);
  
    var waypoints = [];
    for (var i = 1; i < allRoutes[route].length; i++) {
      waypoints.push({
        location: new google.maps.LatLng(allRoutes[route][i].lat, allRoutes[route][i].lng),
        stopover: false
      })
      
    }
  
    var selectedMode = "Driving"
    var request = {
      origin: origin,
      destination: dest,
      travelMode: google.maps.TravelMode[selectedMode],
      waypoints: waypoints,
      provideRouteAlternatives: false,
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.IMPERIAL
    };
    directionsService.route(request, function (response, status) {
      if (status == 'OK') {
        console.log(response);
        console.log(status);
  
        directionsRenderer.setDirections(response);
      }
    });

  // }
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

// Adds a marker to the map.
function addMarker(location) {
  console.log(JSON.stringify(location));
  user_markers.push(new google.maps.Marker({
    position: location,
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    label: labels[labelIndex++ % labels.length],
    title: JSON.stringify(location),
    map: map,
  }));

}

// not really using at the moment, but it is fun
function addLatLngToPoly(latLng, poly) {
  path = poly.getPath();

  //.............TESTING...................
  //   let testDocument = {
  //     "title": "",
  //     "latlng": latLng,  
  //     "route": { "r2": stopNum[stopIndex]}
  // }
  //   stopIndex++;
  //   put('http://localhost:3000/test', testDocument)
  //..............End TEST..................

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
