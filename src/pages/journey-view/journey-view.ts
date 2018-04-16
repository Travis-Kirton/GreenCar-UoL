import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Route } from '../../models/route';
import { RoutingService } from './../../services/routing';
import { CreateJourneyPage } from '../create-journey/create-journey';
import { AuthService } from '../../services/auth';
import { Journey } from '../../models/journey';
import { JourneyMatchingService } from '../../services/journeyMatching';
import { AboutPage } from '../about/about';
import { UserService } from '../../services/user';


@Component({
  selector: 'page-journey-view',
  templateUrl: 'journey-view.html',
})
export class JourneyViewPage {

  userType: any;

  start: string = '';
  end: string = ''
  duration: number = 15;
  routeSet: boolean = false;
  btnAddTitle = 'Add Route';
  myDate: number;
  myTime: number;
  repeating: boolean = false;
  route: number[][] = [];
  userName = this.authService.getUsername();
  luggageWeight: number;
  seatsAvailable: number;

  suggestedDrivers: Journey[] = [];
  currentDriver: Journey[] = [];

  daysOfWeek = {
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public routingService: RoutingService,
    public userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public jmService: JourneyMatchingService) {
  }

  ngOnInit() {
    if (this.navParams.get('isSet')) {
      this.routeSet = true;
      this.start = this.navParams.get('start');
      this.end = this.navParams.get('destination')
      this.route = this.navParams.get('route')
      this.btnAddTitle = 'Edit Route';
      let suggestedRoute = this.jmService.findClosestStartMatch(this.route[0][0], this.route[0][1]);
      this.suggestedDrivers.push(suggestedRoute);
    } else if (this.navParams.get('showRoute')) {
      let route = this.navParams.get('route');
      this.routeSet = true;
      this.start = route.start;
      this.end = route.end;
      this.route = route.coords;
      this.myDate = route.startDate;
      this.myTime = route.pickUpTime;
      this.repeating = route.repeating;
      this.daysOfWeek = route.daysOfWeek;
      this.luggageWeight = route.luggageWeight;
      this.seatsAvailable = route.seatsAvailable;
    } else {
      this.routeSet = false;
    }
  }

  addRoute() {
    if (this.routeSet) {
      this.navCtrl.push(CreateJourneyPage, { route: this.route, start: this.start, end: this.end, isSet: true });
    } else {
      this.navCtrl.push(CreateJourneyPage);
    }
  }

  addJourney() {
    const loading = this.loadingCtrl.create({
      content: 'Saving...'
    });

    if (!this.repeating) {
      this.daysOfWeek.Mon = false;
      this.daysOfWeek.Tue = false;
      this.daysOfWeek.Wed = false;
      this.daysOfWeek.Thu = false;
      this.daysOfWeek.Fri = false;
      this.daysOfWeek.Sat = false;
      this.daysOfWeek.Sun = false;
    }

    if (this.userService.getUserRole().rider) {
      let journey = new Route(Date.now(), this.myDate, this.myTime, false, this.start, this.end, this.route, this.userName, this.repeating, this.daysOfWeek, this.luggageWeight);
      this.routingService.addRoute(journey);
    }else if (this.userService.getUserRole().driver){
      let journey = new Route(Date.now(), this.myDate, this.myTime, false, this.start, this.end, this.route, this.userName, this.repeating, this.daysOfWeek, this.seatsAvailable);
      this.routingService.addRoute(journey);
    }

    this.authService.getActiveUser().getToken().then((token => {
      this.routingService.storeRoutes(token)
        .subscribe(
          () => {
            loading.dismiss()
            this.navCtrl.setRoot(AboutPage);
          },
          error => {
            loading.dismiss();
            this.handleError(error.json().error);
          }
        );
    }));
  }

  cancelJourney() {
    this.navCtrl.setRoot(AboutPage);
  }

  showRoute(route: Route, index: number) {
    this.navCtrl.push(CreateJourneyPage, { route: route, isSet: true });
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

}
