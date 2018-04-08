import { Route } from './../../models/route';
import { RoutingService } from './../../services/routing';
import { AuthService } from './../../services/auth';
import { LoadingController, AlertController } from 'ionic-angular';
import { CreateJourneyPage } from './../create-journey/create-journey';
import { JourneyViewPage } from '../journey-view/journey-view';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  routes: Route[];

  private journeys: string = "createdJourneys";


  constructor(public navCtrl: NavController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private routingService: RoutingService) {

  }

  createJourney() {
    this.navCtrl.push(JourneyViewPage);
  }

  ionViewDidLoad() {
    // check role and load specific lists
    this.loadRoutes();
  }

  loadRoutes() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.authService.getActiveUser().getIdToken()
      .then(
      (token: string) => {
        this.routingService.fetchRoutes(token)
          .subscribe(
          (route: Route[]) => {
            loading.dismiss();
            if (route) {
              this.routes = route;
            } else {
              this.routes = [];
            }
          },
          error => {
            loading.dismiss();
            this.handleError(error.json().error);
          }
          );
      });
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

  showRoute(route: Route) {
    this.navCtrl.push(JourneyViewPage, { route: route, isSet: true});
  }

}
