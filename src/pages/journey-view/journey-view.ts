import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import { Route } from '../../models/route';
import { RoutingService } from './../../services/routing';
import { CreateJourneyPage } from '../create-journey/create-journey';
import { AuthService } from '../../services/auth';
import { Journey } from '../../models/journey';
import { JourneyMatchingService } from '../../services/journeyMatching';
import { AboutPage } from '../about/about';


@Component({
  selector: 'page-journey-view',
  templateUrl: 'journey-view.html',
})
export class JourneyViewPage {

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
              public authService : AuthService,
              public routingService: RoutingService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public jmService: JourneyMatchingService) {
  }

  ngOnInit() {
    if (this.navParams.get('isSet')) {
      this.routeSet = true;
      this.start = this.navParams.get('start');
      this.end = this.navParams.get('destination');
      this.route = this.navParams.get('route');
      this.btnAddTitle = 'Edit Route';
      let suggestedRoute = this.jmService.findClosestStartMatch(this.route[0][0], this.route[0][1]);

     this.suggestedDrivers.push(suggestedRoute);
    }else{
      this.routeSet = false;
    }

    console.log(this.myDate);
  }

  addRoute(){
    if(this.routeSet){
      let journey = new Route(Date.now(), this.myDate, this.myTime, false, this.start, this.end, this.route, this.userName, this.daysOfWeek)
      this.navCtrl.push(CreateJourneyPage,  { journey: journey, isSet: true });
    }else{
    this.navCtrl.push(CreateJourneyPage);
    }
  }

  addJourney(){
    const loading = this.loadingCtrl.create({
      content: 'Saving...'
    });
    console.log(this.navParams.get('route'));
    this.routingService.addRoute(this.navParams.get('route'));
        this.authService.getActiveUser().getToken().then((token => {
          this.routingService.storeRoutes(token)
            .subscribe(
            () => loading.dismiss(),
            error => {
              loading.dismiss();
              this.handleError(error.json().error);
            }
            );
          this.navCtrl.popToRoot();
        }));
  }

  cancelJourney(){
    this.navCtrl.setRoot(AboutPage);
  }

  showRoute(route: Route, index: number) {
    this.navCtrl.push(CreateJourneyPage, { route: route, isSet: true});
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
