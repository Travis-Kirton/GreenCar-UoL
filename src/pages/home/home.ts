import { CreateJourneyPage } from './../create-journey/create-journey';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController) {

  }

  createJourney(){
    this.navCtrl.push(CreateJourneyPage);
  }

}
