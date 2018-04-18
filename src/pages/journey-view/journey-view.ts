import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Route } from '../../models/route';
import { RoutingService } from './../../services/routing';
import { CreateJourneyPage } from '../create-journey/create-journey';
import { AuthService } from '../../services/auth';
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
  myDate: string;
  myTime: string;
  repeating: boolean = false;
  route: number[][] = [];
  userName = this.authService.getUsername();
  luggageWeight: number;
  seatsAvailable: number;
  description: string;
  comments: string[] = [];

  suggestedRoutes: Route[] = [];
  currentDriver: Route[] = [];

  daysOfWeek = {
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false
  }

  userRole: any;

  private journey: Route;
  private journeys: string = "journeys";

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
      //let suggestedRoute = this.jmService.findClosestStartMatch(this.route[0][0], this.route[0][1]);
      //this.suggestedDrivers.push(suggestedRoute);
    } else if (this.navParams.get('showRoute')) {
      let route = this.navParams.get('route');

      console.log(route);
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
      this.description = route.description;
      this.comments = route.comments;
      this.suggestedRoutes = route.suggestedRoutes;

      console.log(this.suggestedRoutes);
    } else {
      this.routeSet = false;
    }

    this.userRole = this.userService.getUserRole();
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

    if (this.userRole.rider) {
      this.journey = new Route('unmatched', false, Date.now(), this.myDate, this.myTime, this.start, this.end, this.route, this.userName, this.repeating, this.daysOfWeek, this.description, this.comments, this.luggageWeight);

    } else if (this.userRole.driver) {
      this.journey = new Route('unmatched', false, Date.now(), this.myDate, this.myTime, this.start, this.end, this.route, this.userName, this.repeating, this.daysOfWeek, this.description, this.comments, this.seatsAvailable);
    }

    let matches = this.jmService.findClosestStartMatch(this.route[0][0], this.route[0][1]);
    this.suggestedRoutes = this.jmService.matchBasedOnTimeAndPref(matches, this.journey);
    this.journey.setSuggestedRoutes(this.suggestedRoutes);

    console.log(this.suggestedRoutes);

    this.routingService.addRoute(this.journey);


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
