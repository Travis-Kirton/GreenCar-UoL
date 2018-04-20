import { RoutingService } from './../../services/routing';
import { AuthService } from './../../services/auth';
import { LoadingController, AlertController } from 'ionic-angular';
import { CreateJourneyPage } from './../create-journey/create-journey';
import { JourneyViewPage } from '../journey-view/journey-view';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JourneyRetrievalService } from '../../services/journeyRetrieval';
import { JourneyMatchingService } from '../../services/journeyMatching';
import { UserService } from '../../services/user';
import { NotificationsService } from '../../services/notifications';
import { MatchedJourneyPage } from '../matched-journey/matched-journey';
import { Route } from '../../models/route';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  routes: Route[];
  userRole: any;

  matchedColour = '#000';

  private journeys: string = "createdJourneys";


  constructor(public navCtrl: NavController,
    private authService: AuthService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private routingService: RoutingService,
    private journeyRetrieval: JourneyRetrievalService,
    private journeyMatching: JourneyMatchingService,
    private notificationService: NotificationsService
  ) {

  }

  private createJourney() {
    this.navCtrl.push(JourneyViewPage);
  }

  ionViewDidLoad() {
    //load specific lists
    this.loadRoutes();
    this.journeyRetrieval.getJourneys();
  }

  private loadRoutes() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.authService.getActiveUser().getIdToken()
      .then((token: string) => {
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

  private showRoute(route: Route) {
    console.log("asdasad");
    if (route.status == "matched") {
      this.navCtrl.push(MatchedJourneyPage, { route: route });
    } else {
      this.navCtrl.push(JourneyViewPage, { route: route, showRoute: true });
    }
  }

  private changeCheckColour(status, disabled): string {
    if (disabled == true) {
      return 'gray'
    } else {
      switch (status) {
        case 'unmatched':
          return '#f15959';
        case 'matched':
          return '#64bb64';
        case 'pending':
          return '#f3aa6f';
      }
    }
  }

}
