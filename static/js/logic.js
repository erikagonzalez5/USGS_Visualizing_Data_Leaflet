// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//createMap function
function createMap(earthquake) {
   
    //creating tile layers that will be the background of the map
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.streets",
    accessToken: API_KEY
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.dark",
    accessToken: API_KEY
    });

    //creating base and overlay layers
    const earthquakes = new L.Layergroup();
    
    let baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    let overlayMaps= {
        Earthquakes: earthquakes
    };

     // Creating the map object with options
    let myMap = L.map("map", {
        center: [34.0522, -118.2437],
        zoom: 8,
        layers: [streetmap]
    });

    //creating the layer control and pass it baseMaps and overlayMaps. add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

    //create a GeoJSON layer
    L.geoJSON(earthquake, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: size(feature.properties.mag),
                fillcolor: colors(features.properties.mag),
                color: "white",
                opacity: 0.5,
                fillOpacity: 1
            });
            
        },

        //use onEachFeature function
        onEachFeature: onEachFeature
    }).addTo(myMap)

    //adding the pop up
    function onEachFeature(feature, layer){
        layer.bindPopup("Location: " + feature.properties.place + "<br> Magnitude:</br>" + feature.properties.magnitude)
    };

    //creating the legend
    let legend = L.control({ position: "bottomleft"});
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let magnitudes = [1, 2, 4, 5];
        let labels = [];

        div.innerHTML += "<h4>Magnitude</h4>"

        for (let i = 0; i <magnitudes.length; i++) {
            div.innerHTML += '<i style="background: ' + colors(magnitudes[i] + 1) + '"></i> ' + magnitudes[i] + (magnitudes[i+1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div;

    };

    legend.addTo(myMap)


};

//determine size of circles based on magnitude
function size (magnitudes) {
    return magnitudes * 2
};

//assign colors specific to magnitudes of earthquakes
function colors (magnitudes) {
    if (magnitudes > 5) {
        return "#fa9a5f"
    } else if (magnitudes > 4) {
        return "#fbb92e"
    } else if (magnitudes > 3) {
        return "#f6de1a"
    } else if (magnitudes > 2) {
        return "##dcf900"
    } else if (magnitudes > 1) {
        return "#a7fb09"
    } else {
        return "#ff5967"
    }
};


// Get the data with d3.
d3.json(geoData, function(data) {
//     createFeatures(geoData.features);
// });

    createMap(response.features);



    
});



