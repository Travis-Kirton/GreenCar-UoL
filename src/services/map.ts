import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Observable, Subject } from 'rxjs/Rx';
import * as L from 'leaflet';



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

  constructor(private toastCtrl: ToastController) { }

  initialise(): void {

    this.map = L.map("map", {
      center: [52.633141, -1.136198],
      zoom: 16,
      zoomControl: false,
      maxZoom: 18
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(this.map);

    this.map.locate({ setView: true, maxZoom: 17 });
    this.map.on('locationfound', (e) => this.onLocationFound(e));
    this.map.on('click', (e) => { this.onMapClick(e) });
  }

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

  onMapClick(e) {
    //check for maximum 2 markers (start+end)
    if (this.seMarkCounter < this.MARKER_MAX) {
      if (this.seMarkCounter < 1) {
        console.log(e.latlng);
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

  drawRoute(latlngs) {
    let start = null;
    let end = null;

    this.polyline = L.polyline(latlngs, { color: 'red' }).addTo(this.map);
    this.map.fitBounds(this.polyline.getBounds());

    this.startMarker = L.marker(latlngs[0], { icon: this.startIcon, draggable: true }).addTo(this.map);
    this.endMarker = L.marker(latlngs[latlngs.length - 1], { icon: this.endIcon, draggable: true }).addTo(this.map);
    this.markersDragged();
    latlngs = null;
  }

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
    popupAnchor: [-3, -76],
    shadowSize: [68, 95],
  });

  endIcon = L.icon({
    iconUrl: '../assets/icon/end.png',
    iconSize: [38, 42],
    iconAnchor: [20, 42],
    popupAnchor: [-3, -76],
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



