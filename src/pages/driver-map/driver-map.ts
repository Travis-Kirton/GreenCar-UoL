import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapService } from '../../services/map';
import { Route } from '../../models/route';

@Component({
  selector: 'page-driver-map',
  templateUrl: 'driver-map.html',
})
export class DriverMapPage implements OnInit {

  journey: Route;
  users: any;
  mapObjects: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mapService: MapService) {
  }

  ngOnInit() {
    this.journey = this.navParams.get('journey');
    this.users = this.navParams.get('users');
    this.mapService.initialise();
    
    this.users.forEach(element => {
      this.mapObjects.push({
        coords: element.journey.coords,
        options: {
          color: 'blue',
          opacity: 0.7,
          dashArray: "5 5",
        },
        popup: {
          start: `<b>${element.username}</b>`,
          end: `<b>${element.username}</b>`
        }
      });
    });

    this.mapObjects.push({
      coords: this.journey.coords,
      options: {
        color: 'red',
        opacity: 1.0
      },
      popup: {
        start: '<b>Driver</b>',
        end: '<b>Driver</b>'
      }
    });

    this.mapService.drawMultipleRoutes(this.mapObjects);

  }

}
