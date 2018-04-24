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
import { Observable } from 'rxjs/Observable';
import { NotificationMessage } from '../../models/notification';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/User';
import { CommentMessage } from '../../models/comment';
import { CommentService } from '../../services/commentService';


@Component({
  selector: 'page-journey-view',
  templateUrl: 'journey-view.html',
})
export class JourneyViewPage {

  journeyKey: string;

  userType: any;
  start: string = '';
  end: string = ''
  routeSet: boolean = false;
  btnAddTitle = 'Add Route';
  dateBooked: number;
  myDate: number;
  myTime: number;
  repeating: boolean = false;
  route: number[][] = [];
  userName = this.authService.getUsername();
  status: string;
  luggageWeight: number;
  seatsAvailable: number;
  description: string;
  comments: any[] = [];
  users: object[] = [];

  suggestedRoutes: Route[] = [];
  suggestedRiders: object[] = [];
  currentDriver: Route[] = [];

  daysOfWeek: any = {
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

  notifications: Observable<NotificationMessage[]>;
  commentList$: Observable<CommentMessage[]>
  commentText: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public routingService: RoutingService,
    public userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public jmService: JourneyMatchingService,
    public notifService: NotificationsService,
    public commentService: CommentService,
    public popCtrl: PopoverController,
    public afDatabase: AngularFireDatabase) {

    this.notifications = this.notifService
      .getNotifications()
      .snapshotChanges() // Key:Value pairs
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      });
  }

  ionViewDidLoad() {
    this.checkPendingNotifications();
  }

  ngOnInit() {
    this.userRole = this.userService.getUserRole();

    if (this.navParams.get('isSet')) {
      this.routeSet = true;
      this.start = this.navParams.get('start');
      this.end = this.navParams.get('destination')
      this.route = this.navParams.get('route')
      this.btnAddTitle = 'Edit Route';
    } else if (this.navParams.get('showRoute')) {
      this.journeyKey = this.navParams.get('key');
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
      this.suggestedRoutes = this.journey.suggestedRoutes;
      this.users = this.journey.users;
      this.status = this.journey.status;

      this.commentList$ = this.commentService
        .getComments(this.authService.getActiveUser().uid, this.journeyKey) // DB List
        .snapshotChanges() // Key:Value pairs
        .map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val()
          }));
        });

      // //match on each load of journey (only if no pending requests)
      // if (this.status == "unmatched") {
      //   let matches = this.jmService.findClosestStartMatch(this.route[0][0], this.route[0][1]);
      //   console.log(matches);
      //   console.log(this.journey);
      //   this.suggestedRoutes = [];
      //   this.suggestedRoutes = this.jmService.matchBasedOnTimeAndPref(matches, this.journey);
      //   console.log(this.suggestedRoutes);
      //   this.journey.suggestedRoutes = this.suggestedRoutes;
      // }

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

    if (this.userRole.rider) {
      this.journey = {
        uid: this.authService.getActiveUser().uid,
        role: this.userRole,
        status: 'unmatched',
        disabled: false,
        dateBooked: Date.now(),
        startDate: this.myDate,
        pickUpTime: this.myTime,
        start: this.start,
        end: this.end,
        coords: this.route,
        username: this.userName,
        repeating: this.repeating,
        daysOfWeek: this.daysOfWeek,
        description: this.description,
        comments: this.comments,
        luggageWeight: this.luggageWeight
      };

    } else if (this.userRole.driver) {
      let riders: object[] = []
      this.journey = {
        uid: this.authService.getActiveUser().uid,
        role: this.userRole,
        status: 'unmatched',
        disabled: false,
        dateBooked: Date.now(),
        startDate: this.myDate,
        pickUpTime: this.myTime,
        start: this.start,
        end: this.end,
        coords: this.route,
        username: this.userName,
        repeating: this.repeating,
        daysOfWeek: this.daysOfWeek,
        description: this.description,
        comments: this.comments,
        luggageWeight: 0,
        seatsAvailable: this.seatsAvailable,
        users: riders
      };
      console.log(this.journey);
    }

    let matches = this.jmService.findClosestStartMatch(this.route[0][0], this.route[0][1]);
    this.suggestedRoutes = [];
    this.suggestedRoutes = this.jmService.matchBasedOnTimeAndPref(matches, this.journey);

    this.journey.suggestedRoutes = this.suggestedRoutes;
    this.routingService.addRoute(this.journey);
    this.navCtrl.setRoot(AboutPage);
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
    route.status = "pending";
    console.log(route);
    this.routingService.updateJourney(this.journeyKey, this.journey, );
    let userUID = this.authService.getActiveUser().uid;
    this.notifService.pushNotificationToUser(userUID, route.dateBooked, "joining", route.uid, this.journey);
  }
  checkPendingNotifications() {
    let userUID = this.authService.getActiveUser().uid;

    this.notifications.forEach(notification => {
      notification.forEach(notif => {
        if (notif.request == "joining") {
          if (this.journey.dateBooked == undefined) {
            console.log(this.journey.dateBooked);
            console.log(this.myDate);
            this.journey.dateBooked = this.myDate
          }
          if (notif.journeyDate == this.journey.dateBooked) {
            this.suggestedRiders.push(notif);
          }
        } else if (notif.request == "accepting") {
          this.suggestedRoutes.forEach((route: any) => {
            if (route.dateBooked == notif.journeyDate) {
              if (this.journey.status == "pending") {
                this.journey.status = "matched";
                this.journey.matchedRoute = route;
                const alert = this.alertCtrl.create({
                  title: 'Matched! :)',
                  message: 'This journey has been accepted by ' + notif.username,
                  buttons: ['Ok']
                });
                alert.present();
                this.navCtrl.setRoot(MatchedJourneyPage, { route: this.journey });
                this.routingService.updateJourney(this.journeyKey, this.journey);
              }
            }
          });
        }
      });
    })

  }

  acceptRiderRequest(rider: any, index) {
    // send notification to user with accept & include journeyDate

    let userUID = this.authService.getActiveUser().uid;
    this.notifService.pushNotificationToUser(userUID, rider.journeyDate, "accepting", rider.userID, this.journey);

    //remove rider from suggested riders
    this.suggestedRiders.splice(index);

    // add user into current journey 
    if (this.journey.users == undefined) this.journey.users = [];

    this.journey.users.push(rider);
    this.routingService.updateJourney(this.journeyKey, this.journey);
    this.navCtrl.setRoot(AboutPage);
  }

  userOptions(user) {
    let popover = this.popCtrl.create(PopoverHomePage);
    popover.present();
  }

  postComment() {
    this.commentService.addComment(this.journeyKey, this.commentText, this.authService.getActiveUser().uid).then(ref => {
    });
    this.commentText = ' ';
  }

}
