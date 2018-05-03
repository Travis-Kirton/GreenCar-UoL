import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Observable, Subject } from 'rxjs/Rx';
import * as L from 'leaflet';

/**
 * Author: Travis Kirton
 * Desription: MapService @Service Component
 * Date: 03/05/2018
 */

@Injectable()
export class MapService {
  myUuid: string;
  map: L.Map;

  // marker for ensuring counters don't go above 2
  readonly MARKER_MAX: number = 2;
  seMarkCounter: number = 0;
  currentLocation: any;

  private startPosition = new Subject<any>();
  private endPosition = new Subject<any>();
  startMarker: L.Marker;
  endMarker: L.Marker
  polyline: L.Polyline;

  //variable to stop more markers being placed
  placeMarkers: boolean = true;

  constructor(private toastCtrl: ToastController) { }

  // Initialised map
  initialise(): void {
    this.seMarkCounter = 0;
    this.placeMarkers = true;

    this.map = L.map("map", {
      center: [52.633141, -1.136198],
      zoom: 16,
      zoomControl: false,
      maxZoom: 18
    });

    // Adding OpenStreetMap Tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(this.map);

    // If Location of user found, call specific methods
    // If map clicked on, call specific methods
    this.map.locate({ setView: true, maxZoom: 17 });
    this.map.on('locationfound', (e) => this.onLocationFound(e));
    this.map.on('click', (e) => { this.onMapClick(e) });
  }

  // Pan to current location and add marker
  onLocationFound(e) {
    this.currentLocation = e;
    if (this.currentLocation == undefined) {
      let toast = this.toastCtrl.create({
        message: 'Failed to get Location data',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      let currLoc = L.marker(this.currentLocation.latlng, { icon: this.currentLocIcon }).addTo(this.map);
      this.map.panTo(this.currentLocation.latlng, {
        animate: true,
        duration: 0.5
      });
    }
  }

  // On map click add markers (no more than 2)
  onMapClick(e) {
    //check for maximum 2 markers (start+end)
    if (this.seMarkCounter < this.MARKER_MAX) {
      if (this.seMarkCounter < 1) {
        this.startMarker = L.marker(e.latlng, {
          icon: this.startIcon,
          draggable: true
        }).addTo(this.map);
        this.startPosition.next(this.startMarker);
      } else {
        this.endMarker = L.marker(e.latlng, {
          icon: this.endIcon,
          draggable: true
        }).addTo(this.map);
        this.endPosition.next(this.endMarker);
      }
      this.seMarkCounter += 1;
    }
    this.markersDragged();
  }

  //lock markers to road positions
  repositionStartMarker(lat, lon) {
    this.startMarker.setLatLng([lat, lon]);
  }

  repositionDestinationMarker(lat, lon) {
    this.endMarker.setLatLng([lat, lon]);
  }

  get eventStart() {
    return this.startPosition.asObservable();
  }

  get eventEnd() {
    return this.endPosition.asObservable();
  }

  getMap() {
    return this.map;
  }

  getCurrentLocation(): L.LatLng {
    return this.currentLocation.latlng;
  }

  // Draw Single route based on coordinates and color/style options
  drawRoute(latlngs, color?, lineStyle?) {
    let start = null;
    let end = null;

    this.polyline = L.polyline(latlngs, { color: '#0099cc' }).addTo(this.map);
    this.map.fitBounds(this.polyline.getBounds());

    this.startMarker = L.marker(latlngs[0], { icon: this.startIcon, draggable: true }).addTo(this.map);
    this.endMarker = L.marker(latlngs[latlngs.length - 1], { icon: this.endIcon, draggable: true }).addTo(this.map);
    this.seMarkCounter = 2;
    this.markersDragged();
    latlngs = null;
  }

  // Draw Multiple route based on coordinates and color/style options
  drawMultipleRoutes(routeMapObjects){
    let start = null;
    let end = null;
    let polyLine = null;
    this.placeMarkers = false;

    routeMapObjects.forEach(element => {
      polyLine = L.polyline(element.coords, element.options).addTo(this.map);
      this.map.fitBounds(polyLine.getBounds());
      L.marker(element.coords[0], { icon: this.startIcon, draggable: true })
      .bindPopup(element.popup.start)
      .addTo(this.map);
      L.marker(element.coords[element.coords.length - 1], { icon: this.endIcon, draggable: true })
      .bindPopup(element.popup.end)
      .addTo(this.map);
    });
    this.seMarkCounter = 2;
  }

  // If Markers are dragged, update road positions
  markersDragged() {
    this.startMarker.on('dragend', (event) => {
      this.startPosition.next(this.startMarker);
    });
    // if: ensures both markers are in place
    if (this.seMarkCounter > 1) {
      this.endMarker.on('dragend', (event) => {
        this.endPosition.next(this.endMarker);
      });
    }
  }



  
  startIcon = L.icon({
    iconUrl: '../assets/icon/start.png',
    iconSize: [38, 42],
    iconAnchor: [20, 42],
    popupAnchor: [-3, -30],
    shadowSize: [68, 95],
  });

  endIcon = L.icon({
    iconUrl: '../assets/icon/end.png',
    iconSize: [38, 42],
    iconAnchor: [20, 42],
    popupAnchor: [-3, -30],
    shadowSize: [68, 95],
  });

  currentLocIcon = L.icon({
    iconUrl: '../assets/icon/pulse_dot.gif',
    iconSize: [30, 30],
    iconAnchor: [20, 42],
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
  });
}



