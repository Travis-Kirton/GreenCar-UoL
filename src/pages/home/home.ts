import { Route } from './../../models/route';
import { RoutingService } from './../../services/routing';
import { AuthService } from './../../services/auth';
import { LoadingController, AlertController } from 'ionic-angular';
import { CreateJourneyPage } from './../create-journey/create-journey';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  routes: Route[];


  constructor(public navCtrl: NavController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private routingService: RoutingService) {

  }

  createJourney() {
    this.navCtrl.push(CreateJourneyPage);
  }

  ionViewDidLoad() {
    this.loadRoutes();
  }

  loadRoutes() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    //loading.present();
      this.routingService.fetchRoutes(this.authService.getActiveUserToken())
        .subscribe(
        (list: Route[]) => {
          loading.dismiss();
          if (list) {
            this.routes = list;
          } else {
            this.routes = [];
          }
        },
        error => {
          loading.dismiss();
          //this.handleError(error.json().error);
          console.log("Error accessing firebase DB");
        }
        );
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

  reorderItems(data) {
    this.routingService.reorderRoutines(data);
  }

  showRoute(route: Route, index: number){
    this.navCtrl.push(CreateJourneyPage, {route: route,isSet: true , index: index});
  }

}
