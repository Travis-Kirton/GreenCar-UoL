import { RoutingService } from './../../services/routing';
import { AuthService } from './../../services/auth';
import { LoadingController, AlertController } from 'ionic-angular';
import { CreateJourneyPage } from './../create-journey/create-journey';
import { JourneyViewPage } from '../journey-view/journey-view';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../services/user';
import { NotificationsService } from '../../services/notifications';
import { MatchedJourneyPage } from '../matched-journey/matched-journey';
import { Observable } from 'rxjs/Observable';
import { Route } from '../../models/route';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Author: Travis Kirton
 * Desription: AboutPage Component
 * Date: 03/05/2018
 */

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  routes: Observable<Route[]>;
  userRole: any;
  matchedColour = '#000';
  private journeys: string = "createdJourneys";


  constructor(public navCtrl: NavController,
    private authService: AuthService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private routingService: RoutingService,
    private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private notificationService: NotificationsService,
  ) {}

  // Push JourneyViewPage
  private createJourney() {
    this.navCtrl.push(JourneyViewPage);
  }

  // on page load, populate routes
  ionViewDidLoad() {
    this.routes = this.routingService
    .getRoutes() // DB List
      .snapshotChanges() // Key:Value pairs
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      });
  }

  // on clicking route, navigate to page with arguments passed
  private showRoute(route: Route, key: string) {
    if (route.status == "matched") {
      this.navCtrl.push(MatchedJourneyPage, { route: route});
    } else {
      this.navCtrl.push(JourneyViewPage, { route: route, showRoute: true, key: key });
    }
  }

  // Change tick colour depending on journey status
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

  // on leaving page, unsubscribe to Observable
  ngOnDestroy(){
    this.routes.subscribe().unsubscribe();
  }

}
