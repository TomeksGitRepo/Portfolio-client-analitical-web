import React from "react";
import L from "leaflet";
import statesData from "./voivodship";

const style = {
  width: "100%",
  height: "500px",
};

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.numberOfMap = props.numberOfThisMap;
    this.mapName = "map" + this.numberOfMap;
    this.mapReference = Object.assign({}, L);
  }

  componentDidMount() {
    //   // create map
    this.map = this.mapReference.map(this.mapName, {
      center: [52.229676, 21.012229],
      dragging: false,
      doubleClickZoom: "center",
      scrollWheelZoom: false,
      touchZoom: false,
      zoom: "center",
      layers: [
        L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    });

    // control that shows state info on hover
    var info = L.control();

    info.onAdd = function (map) {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };

    info.update = function (props) {
      this._div.innerHTML =
        "<h4>US Population Density</h4>" +
        (props
          ? "<b>" +
            props.name +
            "</b><br />" +
            props.density +
            " people / mi<sup>2</sup>"
          : "Najedź myszką na województwo");
    };

    // info.addTo(this.mapName);

    // get color depending on population density value
    function getColor(d) {
      return d > 1000
        ? "#800026"
        : d > 500
        ? "#BD0026"
        : d > 200
        ? "#E31A1C"
        : d > 100
        ? "#FC4E2A"
        : d > 50
        ? "#FD8D3C"
        : d > 20
        ? "#FEB24C"
        : d > 10
        ? "#FED976"
        : "#FFEDA0";
    }

    function style(feature) {
      return {
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.density),
      };
    }

    function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }

      info.update(layer.feature.properties);
    }

    var geojson;

    function resetHighlight(e) {
      geojson.resetStyle(e.target);
      info.update();
    }

    // Disable zoom problem with this.map
    // function zoomToFeature(e) {
    // 	this.map.fitBounds(e.target.getBounds());
    // }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        //	click: zoomToFeature
      });
    }

    // geojson = L.geoJson(statesData, {
    // 	style: style,
    // 	onEachFeature: onEachFeature
    // }).addTo(this.mapName);

    this.map.attributionControl.addAttribution(
      'Population data &copy; <a href="https://census.gov/">US Census Bureau</a>'
    );

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [],
        from,
        to;

      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
            getColor(from + 1) +
            '"></i> ' +
            from +
            (to ? "&ndash;" + to : "+")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    // legend.addTo(this.mapName);

    // add marker
    // this.marker = L.marker(this.props.markerPosition).addTo(this.map);
  }
  // componentDidUpdate({ markerPosition }) {
  //   // check if position has changed
  //   if (this.props.markerPosition !== markerPosition) {
  //     this.marker.setLatLng(this.props.markerPosition);
  //   }
  // }
  render() {
    return <div id={this.mapName} style={style} />;
  }
}

export default Map;
