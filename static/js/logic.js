// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//createMap function
// function createMap(earthquake) {
   
    //creating tile layers that will be the background of the map

const darkmap =  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

let myMap = L.map("map", {
     center: [34.0522, -118.2437],
     zoom: 8,
});

darkmap.addTo(myMap);


// Get the data with d3.
d3.json(geoData).then(function(data) {
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: colors(feature.geometry.coordinates[2]),
          color: "white",
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }

    function colors (magnitudes) {
        if (magnitudes > 5) {
            return "#ea822c"
        } else if (magnitudes > 4) {
            return "#ee9c00"
        } else if (magnitudes > 3) {
            return "#eecc00"
        } else if (magnitudes > 2) {
            return "#dcf900"
        } else if (magnitudes > 1) {
            return "#d4ee00"
        } else {
            return "#ea2c2c"
        }
    };
    function markerSize(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 4;
      }

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,

        onEachFeature(feature, layer) {
            layer.bindPopup(
                "Location: " + feature.properties.place
                 + "<br> Magnitude:</br>" + feature.properties.mag);
        }
    }).addTo(myMap)
        //creating the legend
    let legend = L.control({ position: "bottomright"});
    legend.onAdd = function () {
            let div = L.DomUtil.create("div", "info legend");
            let magnitudes = [1, 2, 3, 4, 5];
            let color = [
                "#ea822c",
                "#ee9c00",
                "#eecc00",
                "#dcf900",
                "#d4ee00",
                "#ea2c2c"
            ];
    
    
            for (let i = 0; i <magnitudes.length; i++) {
                div.innerHTML += "<i style='background: " + color[i] + "'></i> "
                + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
              }
            return div;
    
        };
    
        legend.addTo(myMap);
    
    
    });



