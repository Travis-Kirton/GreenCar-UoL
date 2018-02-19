import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import * as L from 'leaflet';



@Injectable()
export class MapService {

  constructor(private toastCtrl: ToastController) { }

  myUuid: string;
  map: L.Map;
  currentLocation: any;

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

    //this.map.locate({ setView: true, maxZoom: 17 });
    //this.map.on('locationfound', (e) => this.onLocationFound(e));
  }

  onLocationFound(e) {
    this.currentLocation = e;
    L.marker(e.latlng, {icon: this.startIcon}).addTo(this.map);
  }

  locateMe() {
    if (this.currentLocation == undefined) {
      let toast = this.toastCtrl.create({
        message: 'Failed to get Location data',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      this.map.panTo(this.currentLocation.latlng, {
        animate: true,
        duration: 0.5
      });
    }
  }

  getMap() {
    return this.map;
  }

  getCurrentLocation(): L.LatLng {
    return this.currentLocation.latlng;
  }

  drawRoute(latlngs) {
    var polyline = L.polyline(latlngs, { color: 'red' }).addTo(this.map);
    this.map.fitBounds(polyline.getBounds());

    L.marker(latlngs[0], { icon: this.startIcon }).addTo(this.map);
    L.marker(latlngs[latlngs.length - 1], { icon: this.endIcon }).addTo(this.map);
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
}
