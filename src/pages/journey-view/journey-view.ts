import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { Route } from '../../models/route';
import { RoutingService } from './../../services/routing';
import { CreateJourneyPage } from '../create-journey/create-journey';
import { AuthService } from '../../services/auth';
import { JourneyMatchingService } from '../../services/journeyMatching';
import { AboutPage } from '../about/about';
import { UserService } from '../../services/user';
import { JourneyJoiningService } from '../../services/journeyJoining';
import { NotificationsService } from '../../services/notifications';
import { MatchedJourneyPage } from '../matched-journey/matched-journey';
import { PopoverHomePage } from '../popover-home/popover-home';


@Component({
  selector: 'page-journey-view',
  templateUrl: 'journey-view.html',
})
export class JourneyViewPage {

  userType: any;

  start: string = '';
  end: string = ''
  routeSet: boolean = false;
  btnAddTitle = 'Add Route';
  dateBooked: number;
  myDate: string;
  myTime: string;
  repeating: boolean = false;
  route: number[][] = [];
  userName = this.authService.getUsername();
  luggageWeight: number;
  seatsAvailable: number;
  description: string;
  comments: any[] = [];
  users: object[] = [];

  suggestedRoutes: Route[] = [];
  suggestedRiders: object[] = [];
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

  private joinBtn: string = "join";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public routingService: RoutingService,
    public userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public jmService: JourneyMatchingService,
    public jjService: JourneyJoiningService,
    public notifService: NotificationsService,
    public popCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    this.checkPendingNotifications();
  }

  ngOnInit() {
    if (this.navParams.get('isSet')) {
      this.routeSet = true;
      this.start = this.navParams.get('start');
      this.end = this.navParams.get('destination')
      this.route = this.navParams.get('route')
      this.btnAddTitle = 'Edit Route';
    } else if (this.navParams.get('showRoute')) {
      this.journey = this.navParams.get('route');
      this.routeSet = true;
      this.dateBooked = this.journey.dateBooked;
      this.start = this.journey.start;
      this.end = this.journey.end;
      this.route = this.journey.coords;
      this.myDate = this.journey.startDate;
      this.myTime = this.journey.pickUpTime;
      this.repeating = this.journey.repeating;
      this.daysOfWeek = this.journey.daysOfWeek;
      this.luggageWeight = this.journey.luggageWeight;
      this.seatsAvailable = this.journey.seatsAvailable;
      this.description = this.journey.description;
      this.comments = this.journey.comments;
      this.suggestedRoutes = this.journey.suggestedRoutes;
      this.users = this.journey.users;
      console.log(this.comments);
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
      let riders:object[] = []
      this.journey = new Route('unmatched', false, Date.now(), this.myDate, this.myTime, this.start, this.end, this.route, this.userName, this.repeating, this.daysOfWeek, this.description, this.comments, 0 ,this.seatsAvailable, riders);
    }

    let matches = this.jmService.findClosestStartMatch(this.route[0][0], this.route[0][1]);

    this.suggestedRoutes = this.jmService.matchBasedOnTimeAndPref(matches, this.journey);
    this.journey.setSuggestedRoutes(this.suggestedRoutes);
    this.journey.getSuggestedRoutes();
    this.routingService.addRoute(this.journey);
    this.storeRoutes(true);
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

  joinJourney(route) {
    this.journey.status = "pending";
    route.journey.status = "pending";
    let userUID = this.authService.getActiveUser().uid;
    this.authService.getActiveUser().getIdToken().then((token => {
      this.notifService.pushNotificationToUser(userUID, route.journey.dateBooked, "joining", route.uid, token, this.journey)
        .subscribe();

      this.storeRoutes(false);
    }));


  }
  checkPendingNotifications() {
    let notifications = this.notifService.getNotifications();
    notifications.forEach(notification => {
      console.log(notification);

      if (notification.request == "joining") {
        if (notification.journeyDate == this.journey.dateBooked) {
          this.suggestedRiders.push(notification);
        }
      } else if (notification.request == "accepting") {
        this.suggestedRoutes.forEach((route: any) => {
          if (route.journey.dateBooked == notification.journeyDate) {
            if (this.journey.status == "pending") {
              this.journey.status = "matched";
              this.journey.matchedRoute = route;
              this.storeRoutes(false);
              const alert = this.alertCtrl.create({
                title: 'Matched! :)',
                message: 'This journey has been accepted by ' +  notification.username,
                buttons: ['Ok']
              });
              alert.present();
              this.navCtrl.pop();
              this.navCtrl.push(MatchedJourneyPage, { route: this.journey });
              this.notifService.removeNotification(notification);
              this.storeNotifications();
            }
          }
        });
      }
    });
  }

  acceptRiderRequest(rider: any, index) {
    // send notification to user with accept
    // & include journeyDate
    this.authService.getActiveUser().getIdToken().then((token => {
      let userUID = this.authService.getActiveUser().uid;
      this.notifService.pushNotificationToUser(userUID, rider.journeyDate, "accepting", rider.userID, token)
        .subscribe();

    // remove notification
    this.notifService.removeNotification(rider);
    this.storeNotifications();
    }));


     // add user into current journey 
     if(this.journey.users == undefined){
       this.journey.users = [];
       this.journey.users.push(rider);
     }else{
       this.journey.users.push(rider);
     }
   
    //remove rider from suggested riders
    this.suggestedRiders.splice(index);
   
    //push back to Firebase
    this.storeRoutes(false);

  }

  storeRoutes(setRoot: boolean) {
    const loading = this.loadingCtrl.create({
      content: 'Requesting...'
    });
    this.authService.getActiveUser().getToken().then((token => {
      this.routingService.storeRoutes(token)
        .subscribe(
          () => {
            loading.dismiss()
            if (setRoot) {
              this.navCtrl.setRoot(AboutPage);
            }
          },
          error => {
            loading.dismiss();
            this.handleError(error.json().error);
          }
        );
    }));
  }

  storeNotifications() {
    const loading = this.loadingCtrl.create({
      content: 'Requesting...'
    });
    this.authService.getActiveUser().getToken().then((token => {
      this.notifService.storeNotications(token)
        .subscribe(
          () => {
            loading.dismiss()
          },
          error => {
            loading.dismiss();
            this.handleError(error.json().error);
          }
        );
    }));
  }

  userOptions(user){
    let popover = this.popCtrl.create(PopoverHomePage);
    popover.present();
  }

}
