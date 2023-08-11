import React, { Component } from 'react';
import H from '@here/maps-api-for-javascript';

class Map extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.map = null;
        this.platform = null;
    }

    getMarkerIcon(color, label) {
        const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="marker">
                    <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
                    </g>
                    </svg>`;
        return new H.map.Icon(svgCircle, {
            anchor: {
                x: 10,
                y: 10
            }
        });
    }

    componentDidMount() {
        // Check if the map object has already been created
        if (!this.map) {
            // Create a platform object with the API key
            this.platform = new H.service.Platform({ apikey: this.props.apikey });
            // Create a new Raster Tile service instance
            const rasterTileService = this.platform.getRasterTileService({
                queryParams: {
                    style: "explore.day",
                    size: 512,
                },
            });
            // Creates a new instance of the H.service.rasterTile.Provider class
            // The class provides raster tiles for a given tile layer ID and pixel format
            const rasterTileProvider = new H.service.rasterTile.Provider(rasterTileService);
            // Create a new Tile layer with the Raster Tile provider
            const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);

            // Create a new map instance with the Tile layer, center, and zoom level
            const userPosition = {
                lat: 0, lng: 0
            }

            if (this.props.powerPlantPositions) {
                this.props.powerPlantPositions.forEach(position => {
                    userPosition.lat += position.location.lat
                    userPosition.lng += position.location.lng
                });

                userPosition.lat = userPosition.lat / this.props.powerPlantPositions.length
                userPosition.lng = userPosition.lng / this.props.powerPlantPositions.length
            }

            this.map = new H.Map(
                this.mapRef.current,
                rasterTileLayer, {
                    pixelRatio: window.devicePixelRatio,
                    center: userPosition,
                    zoom: 14,
                },
            );

            // Add panning and zooming behavior to the map
            new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
            
            if (this.props.powerPlantPositions && this.props.powerPlantPositions.length > 0) {
                this.map.addObjects(this.props.powerPlantPositions.map(
                    position => new H.map.Marker(
                        position.location, {
                            icon: this.getMarkerIcon('blue', position.name)
                        }
                    )
                ));
            }
        }
    }

    render() {
        // Return a div element to hold the map
        return <div style={{ width: "100%", height: "500px" }} ref={this.mapRef} />;
    }
}

export default Map;
