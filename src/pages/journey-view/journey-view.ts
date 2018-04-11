import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import { Route } from '../../models/route';
import { RoutingService } from './../../services/routing';
import { CreateJourneyPage } from '../create-journey/create-journey';
import { AuthService } from '../../services/auth';


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
  btnAddTitle = 'Add Route';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public authService : AuthService,
              public routingService: RoutingService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    if (this.navParams.get('isSet')) {
      this.routeSet = true;
      let route = this.navParams.get('route');
      this.start = route.start;
      this.end = route.end;
      this.btnAddTitle = 'Edit Route';
    }else{
      this.routeSet = false;
    }
  }

  addRoute(){
    if(this.routeSet){
      this.navCtrl.push(CreateJourneyPage, { route: this.navParams.get('route'), isSet: true });
    }else{
    this.navCtrl.push(CreateJourneyPage);
    }
  }

  addJourney(){
    const loading = this.loadingCtrl.create({
      content: 'Saving...'
    });
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
    this.navCtrl.popToRoot();
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
