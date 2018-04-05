import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Route } from '../../models/route';
import { CreateJourneyPage } from '../create-journey/create-journey';


@Component({
  selector: 'page-journey-view',
  templateUrl: 'journey-view.html',
})
export class JourneyViewPage {

  route:Route;
  start: String = '';
  end: String = ''
  duration: number = 15;
  routeSet: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    if (this.navParams.get('isSet')) {
      this.routeSet = true;
      this.route = this.navParams.get('route');
      this.start = this.route.getStart();
      this.end = this.route.getEnd();
      console.log(this.route);
    }else{
      this.routeSet = false;
    }
  }

  addRoute(){
    this.navCtrl.push(CreateJourneyPage);
  }

  showRoute(route: Route, index: number) {
    this.navCtrl.push(CreateJourneyPage, { route: route, isSet: true, index: index });
  }



}
