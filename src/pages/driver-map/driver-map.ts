import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapService } from '../../services/map';
import { Route } from '../../models/route';

@Component({
  selector: 'page-driver-map',
  templateUrl: 'driver-map.html',
})
export class DriverMapPage implements OnInit{

  journey: Route;
  users: any;
  mapObjects: any[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public mapService: MapService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverMapPage');

   
  }


  ngOnInit() {
    console.log("calling map");
    this.journey = this.navParams.get('journey');
    this.users = this.navParams.get('users');

    

    this.mapService.initialise();

    


  }

}
