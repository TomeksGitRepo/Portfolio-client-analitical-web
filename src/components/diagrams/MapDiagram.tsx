import React from 'react';
import L, { GeoJSON } from 'leaflet';
import Map from './Map';
import statesData from './voivodship'
import { any } from 'prop-types';
import _ from 'lodash';

interface MapState {
	numberOfMap: string,
	mapName: string,
	map: any,
	geojson?: any,
	info?: any,
	legend?: any,
	mapAllValues?: any,
	splitStepArray?: any,
	nameOfKey?: any

}

const style = {
	width: "100%",
	height: "500px"
};

class CustomMap extends React.Component<{ numberOfThisMap: any, voievodeship: any }, MapState> {

	constructor(props: any) {
		super(props);
		this.state = {
			numberOfMap: props.numberOfThisMap,
			mapName: "map" + this.props.numberOfThisMap,
			map: "",
			mapAllValues: []
		}
		//console.log('props.voievodeship', this.props.voievodeship)
		setTimeout(() => this.getAllVoievodeshipValues(), 10) //TODO remove timeout for callback way
		setTimeout(() => this.splitAllValuesOn8Parts(), 10) //TODO remove timeout for callback way

	}

	// get color depending on population density value
	getColor = (d: number) => {
		return d > this.state.splitStepArray[0] ? '#27348B' :
			d > this.state.splitStepArray[1] ? '#2F52A0' :
				d > this.state.splitStepArray[2] ? '#4565AD' :
					d > this.state.splitStepArray[3] ? '#5C79BB' :
						d > this.state.splitStepArray[4] ? '#748FC9' :
							d > this.state.splitStepArray[5] ? '#8DA6D6' :
								d > this.state.splitStepArray[6] ? '#A4BDE4' :
									'#BCD5F0';
	}

	style = (feature: any) => {
		//console.log('in style function feature:', feature)
		var voievodeshipLowerCaseName = feature.properties.name.toLowerCase()
		//console.log('voievodeshipLowerCaseName in style function:', voievodeshipLowerCaseName)

		var rightVoievodeship = this.props.voievodeship.find(((item: any) => {
			return item.województwo === voievodeshipLowerCaseName

		}))
		//console.log('rightVoievodeship in style function: ', rightVoievodeship)

		var valueOfKeyThisVoievodship = rightVoievodeship[this.state.nameOfKey[0]]
		//console.log('valueOfKeyThisVoievodship in style function: ', valueOfKeyThisVoievodship)	


		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: this.getColor(valueOfKeyThisVoievodship)
		};
	}

	getAllVoievodeshipValues = () => {
		var firstElement = this.props.voievodeship[0];
		var keysToDrop = ["rodzaj", "", "województwo", "zrodło", "_id", "tytul"]
		var keysInObject = _.keys(firstElement);
		var diffrence = _.difference(keysInObject, keysToDrop);
		var key = diffrence[0];
		this.setState({ 'nameOfKey': diffrence }) // set name of key for map
		var AllVoievodeshipValues = this.props.voievodeship.map((item: any) => item[key])
		AllVoievodeshipValues = AllVoievodeshipValues.map((item: any) => parseFloat(item)).sort((a: any, b: any) => a - b)
		//console.log('AllVoievodeshipValues: ', AllVoievodeshipValues);
		this.setState({ 'mapAllValues': [...AllVoievodeshipValues] }, () => console.log('state changed in getAllVoievodeshipValues'))
	}

	splitAllValuesOn8Parts = () => {
		var highestScore = this.state.mapAllValues[this.state.mapAllValues.length - 1]
		//console.log('highestScore in splitAllValuesOn8Parts:', highestScore)
		var stepValueArray = []

		var temp = highestScore * 90 / 100;
		stepValueArray.push(temp);
		temp = highestScore * 78 / 100;
		stepValueArray.push(temp);
		temp = highestScore * 66 / 100;
		stepValueArray.push(temp);
		temp = highestScore * 54 / 100;
		stepValueArray.push(temp);
		temp = highestScore * 42 / 100;
		stepValueArray.push(temp);
		temp = highestScore * 30 / 100;
		stepValueArray.push(temp);
		temp = highestScore * 18 / 100;
		stepValueArray.push(temp);

		//console.log('in splitAllValuesOn8Parts stepValueArray: ', stepValueArray);

		this.setState({ 'splitStepArray': stepValueArray })
	}

	resetHighlight = (e: any) => {
		//  console.log("this.state  in resetHighlight:", this.state)

		this.state.geojson.resetStyle(e.target);
		this.state.info.update();
	}

	onEachFeature = (feature: any, layer: any) => {
		layer.on({
			mouseover: this.highlightFeature,
			mouseout: this.resetHighlight,
			//	click: zoomToFeature
		});
	}

	highlightFeature = (e: any) => {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		this.state.info.update(layer.feature.properties);
	}

	componentDidMount() {
		//console.log('In componentDidMount this.state.mapName:', this.state.mapName);
		var zoomValue;
		if (window.innerWidth > 500) {
			zoomValue = 6
		} else {
			zoomValue = 5
		}

		if (this.props.numberOfThisMap) {
			this.setState({
				map: L.map(this.state.mapName, {
					center: [52.229676, 19.012229],
					dragging: false,
					zoom: zoomValue,
					layers: [
						L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
							attribution:
								'&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
						})
					]
				})
			})
		}


		// control that shows state info on hover
		var info: any = new L.Control;

		info.onAdd = function (map: any) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = (props: any) => {
			var value;
			var key;
			//TODO finish this to get correct value key
			if (props != undefined) {
				var voievodeshipLowerLetterName = props.name.toLowerCase();
				var objectWithCorrectValue = _.find(this.props.voievodeship, ['województwo', voievodeshipLowerLetterName]);
				var keysToDrop = ["rodzaj", "", "województwo", "zrodło", "_id", "tytul"]
				//console.log("objectWithCorrectValue:", objectWithCorrectValue);
				var keysInObject = _.keys(objectWithCorrectValue);

				//console.log('keysInObject', keysInObject);
				var diffrence = _.difference(keysInObject, keysToDrop);

				//console.log('diffrence:', diffrence);
				key = diffrence[0];

				value = objectWithCorrectValue[key]

			}


			info._div.innerHTML = '<h4>' + this.props.voievodeship[0].tytul + '</h4>' + (props ?
				'<b>' + props.name + '</b><br />' + value + ' ' + key
				: 'Najedź myszką na województwo');
		};



		this.setState({ info })
		setTimeout(() => {
			//console.log('this.state in setTimeout', this.state)
			if (this.state.map != "") {
				this.state.info.addTo(this.state.map, 400)
			}

		});

		// var geojson : any;



		// Disable zoom problem with this.map
		// function zoomToFeature(e) {
		// 	this.map.fitBounds(e.target.getBounds());
		// }


		setTimeout(() => {
			var tempGeoJson = L.geoJSON(statesData as any, {
				style: this.style,
				onEachFeature: this.onEachFeature
			}).addTo(this.state.map);

			this.setState({ geojson: tempGeoJson })
		}, 200)


		//this.state.map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


		var legend = new L.Control({ position: 'bottomright' });

		legend.onAdd = (map: any) => {
			//console.log('in legend.onAdd this.state', this.state)
			var div = L.DomUtil.create('div', 'info legend'),
				grades = [Math.round(this.state.splitStepArray[6]), Math.round(this.state.splitStepArray[5]), Math.round(this.state.splitStepArray[4]), Math.round(this.state.splitStepArray[3]), Math.round(this.state.splitStepArray[2]), Math.round(this.state.splitStepArray[1]), Math.round(this.state.splitStepArray[0])],
				labels = [],
				from, to;
			var legendLabel = this.state.nameOfKey[0]

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + this.getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+') + ' ' + legendLabel);
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		this.setState({ legend })
		setTimeout(() => {
			//console.log('this.state in setTimeout in legend addition', this.state)
			if (this.state.map != "") {
				this.state.legend.addTo(this.state.map)
			}

		}, 100);
		// legend.addTo(this.mapName);

		// add marker
		// this.marker = L.marker(this.props.markerPosition).addTo(this.map);

	}
	render() {
		return (
			<div className="ui grid">
				<h1 className="sixteen wide column" style={{ textAlign: "center" }}>{this.props.voievodeship[0].tytul}</h1>
				<div id={this.state.mapName} style={style} />
				{/* <Map markerPosition={{ lat: 49.8419, lng: 24.0315 }} numberOfThisMap={2} /> */}
			</div>
		);
	}
}


export default CustomMap;