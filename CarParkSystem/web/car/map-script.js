"use strict";

const API_URL = "http://localhost:5001/api";

var map, infoWindow, carparkInfoWindow;
var directionsService;
var directionsDisplay;
var myLocation = { 'lat': -37.887589, 'lng': 145.119695 };
var carparkCoords_docks = {
  lat: -37.814903,
  lng: 144.935986,
  id: 0,
  slots: 10
};
var carparkCoords_melb = {
  lat: -37.812327,
  lng: 144.963469,
  id: 1,
  slots: 16
};
var carparkCoords_north_melb = {
  lat: -37.799849,
  lng: 144.948869,
  id: 2,
  slots: 19
};  
var carparkCoords_south_melb = {
  lat: -37.834565,
  lng: 144.961064,
  id: 3,
  slots: 5
};
var carparks = [carparkCoords_docks, carparkCoords_melb, carparkCoords_north_melb, carparkCoords_south_melb];
let panorama;

var carparkMarker = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png';


function initMap() {

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: -37.814,
      lng: 144.96332
    },
    zoom: 11
  });
  
  infoWindow = new google.maps.InfoWindow;

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("right-panel"));
  const control = document.getElementById("floating-panel");
  control.style.display = "block";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  laodMarkers();

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function (position) {

      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      myLocation = pos;
      console.log(myLocation);

      infoWindow.setPosition(pos);
      infoWindow.setContent('Your location .');
      infoWindow.open(map);
      map.setCenter(pos);

      var userMarker = new google.maps.Marker({
        position: { 'lat': pos.lat, 'lng': pos.lng },
        map: map
      });

      userMarker.addListener('click', function () {
        infoWindow.setContent("My Location");
        infoWindow.open(map, userMarker);
      })

    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());

  }

  map.addListener('click', function (mapsMouseEvent) {

    infoWindow.close();

    infoWindow = new google.maps.InfoWindow({ position: mapsMouseEvent.latLng });
    var tempLat = mapsMouseEvent.latLng.lat().toString();
    var tempLng = mapsMouseEvent.latLng.lng().toString();

    infoWindow.setContent(tempLat, tempLng);
    infoWindow.open(map);

    getDistToCarparks(tempLat, tempLng);

  });


  var onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };

  document.getElementById('start').addEventListener('click', onChangeHandler);

} // End of init function    

function getDistToCarparks(lat, lng) {

  var bounds = new google.maps.LatLngBounds;
  var geocoder = new google.maps.Geocoder;
  var origin1 = new google.maps.LatLng(lat, lng);
  // var origin2 = 'Greenwich, England';
  var destinationA = new google.maps.LatLng(-37.814903, 144.935986);
  var destinationB = new google.maps.LatLng(-37.812327, 144.963469);
  var destinationC = new google.maps.LatLng(-37.799849, 144.948869);
  var destinationD = new google.maps.LatLng(-37.834565, 144.961064);

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin1],
      destinations: [destinationA, destinationB, destinationC, destinationD],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    }, function (response, status) {
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        console.log(response);
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        var outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';
        // deleteMarkers(markersArray);

        var showGeocodedAddressOnMap = function (asDestination){
        //   var icon = asDestination ? destinationIcon : originIcon;
          return function (results, status) {
            if (status === 'OK') {
              map.fitBounds(bounds.extend(results[0].geometry.location));
              // markersArray.push(new google.maps.Marker({
              //   map: map,
              //   position: results[0].geometry.location,
              //   icon: carparkMarker
              // }));
            } else {
              alert('Geocode was not successful due to: ' + status);
            }

          };

        }

        for (var i = 0; i < originList.length; i++) {
          var results = response.rows[i].elements;
          geocoder.geocode({'address': originList[i]},
              showGeocodedAddressOnMap(false));
          for (var j = 0; j < results.length; j++) {
            geocoder.geocode({'address': destinationList[j]},
                showGeocodedAddressOnMap(true));
            outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
                ': ' + results[j].distance.text + ' in ' +
                results[j].duration.text + '<br>';
          }
        }

      }
    });
}

function distanceToCarparks(lat, lng) {

  var tempLat = lat;
  var templng = lng;
  var closestDist = 11111111111111111111111111111111111111111110; //store the distance of the carpark closest to the destinatio
  var closestCarpark = 0;
  var carparkId = 0;
  var carparkDistances = [];
  var i = 0;

  directionsService = new google.maps.DirectionsService;

  for (i = 0; i <= 3; i++) {
    var tempCarpark = carparks[i];

    var carparkLat = carparks[i].lat;
    var carparkLng = carparks[i].lng;
    carparkId = carparks[i].id;


    directionsService.route({
      origin: {
        lat: parseFloat(tempLat),
        lng: parseFloat(templng),
      },
      destination: {
        lat: parseFloat(carparkLat),
        lng: parseFloat(carparkLng),
      },
      travelMode: 'DRIVING'
    }, function (response, status) {
      if (status === 'OK') {
        console.log("response: :")
        console.log(response);

        var distToCarpark = response.routes[0].legs[0].distance.value;
        carparkDistances.push(distToCarpark);
        console.log(distToCarpark);
        console.log(carparkDistances);

        if (closestDist > distToCarpark) {
          closestDist = distToCarpark;
          closestCarpark = carparkId;
          console.log("INSOIDE")
        }

      } else {
        console.log(response);
        window.alert('Directions request failed due to ' + status);
      }
    });

  }
  setTimeout(function waitForVals() {

    if (carparkDistances.length <= 3) {
      waitForVals();
    } else {
      // findClosesCarpark(carparkDistances);
      console.log(closestDist)
    }

  }, 2000);

}

function findClosesCarpark(carparkDistances) {



}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  console.log(document.getElementById('start').value);

  var tempVal = document.getElementById('start').value;
  var pos = { 'lat': 0, "lng": 0 };

  switch (tempVal) {
    case 'south_melb': {
      pos.lat = -37.834565,
        pos.lng = 144.961064
    }
      break;
    case 'melb': {
      pos.lat = -37.812327,
        pos.lng = 144.963469
    }
      break;
    case 'north_melb': {
      pos.lat = -37.799849,
        pos.lng = 144.948869
    }
      break;
    case 'docks': {
      pos.lat = -37.814903,
        pos.lng = 144.935986
    }
      break;
    default: {
      console.log("Error selecting the carpark from the map");
    }
  }

  directionsService.route({
    origin: {
      lat: myLocation.lat,
      lng: myLocation.lng,
    },
    destination: {
      lat: pos.lat,
      lng: pos.lng,
    },
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {

      console.log(response.routes[0].legs[0].distance.value);

      directionsDisplay.setDirections(response);
    } else {
      console.log(response);
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

// Street View
// function initialize() {
//   panorama = new google.maps.StreetViewPanorama(
//     document.getElementById("street-view"),
//     {
//       position: {
//         lat: 37.86926,
//         lng: -122.254811
//       },
//       pov: {
//         heading: 165,
//         pitch: 0
//       },
//       zoom: 1
//     }
//   );
// }

// function onClickMarker(num){
//   var carParkNo = num;
//   console.log(num);
//   localStorage.setItem('carparkNumber', num);

//   var slots = [
//     {
//       number: 1,
//       carparkNumber: 3,
//       status: true
//     },
//     {
//       number: 2,
//       carparkNumber: 3,
//       status: true
//     },
//     {
//       number: 3,
//       carparkNumber: 3,
//       status: true
//     },
//     {
//       number: 4,
//       carparkNumber: 3,
//       status: true
//     }
//   ];

//   slots.forEach((slot) => {  
//     console.log(slot.number)
//     $('#slots tbody').append(`
//     <td id="taken">
//     ${slot.number}
//     <p>This Slots is taken</p>
//     </td>`      
//     );    
//   });

//   // $.get(`${API_URL}/carpark/${carParkNo}`)  
//   //   .then(response => {    
//   //       slots.forEach((slot) => {  
                 
//   //           $('#slots tbody').append(`
//   //           <td id="taken">
//   //           ${slot.number}
//   //           <p>This Slots is taken</p>
//   //           </td>`      
//   //           );    
//   //       });
//   //   })  
//   //   .catch(error => {    
//   //       console.error(`Error: ${error}`);  
//   //   });
// }

function laodMarkers() {

  var carparkMarker_docklands = new google.maps.Marker({
    position: {
      lat: carparkCoords_docks.lat,
      lng: carparkCoords_docks.lng
    },
    icon: carparkMarker,
    map: map
  });

  carparkMarker_docklands.addListener('click', function () {
    infoWindow.setContent('The Docklands carpark! <br> <a href="/carparkinfo" >CHECK THE SLOT AVAILABILITY!</a>');
    infoWindow.open(map, carparkMarker_docklands);
  });

  var carparkMarker_melbourne = new google.maps.Marker({
    position: {
      lat: carparkCoords_melb.lat,
      lng: carparkCoords_melb.lng
    },
    icon: carparkMarker,
    map: map
  });

  carparkMarker_melbourne.addListener('click', function () {
    infoWindow.setContent("Car park Melbourne");
    infoWindow.open(map, carparkMarker_melbourne);
  });

  var carparkMarker_north_melbourne = new google.maps.Marker({
    position: {
      lat: carparkCoords_north_melb.lat,
      lng: carparkCoords_north_melb.lng
    },
    icon: carparkMarker,
    map: map
  });

  carparkMarker_north_melbourne.addListener('click', function () {
    infoWindow.setContent("Car park North Melbourne");
    infoWindow.open(map, carparkMarker_north_melbourne);
  });

  var carparkMarker_south_melbourne = new google.maps.Marker({
    position: {
      lat: carparkCoords_south_melb.lat,
      lng: carparkCoords_south_melb.lng
    },
    icon: carparkMarker,
    map: map
  });

  carparkMarker_south_melbourne.addListener('click', function () {
    infoWindow.setContent("Car park South Melbourne");
    infoWindow.open(map, carparkMarker_south_melbourne);
  });
}
