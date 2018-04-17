import { Component } from '@angular/core';
import { UserService } from '../../services/user';
import { LoadingController, NavController, AlertController } from 'ionic-angular';
import { AuthService } from './../../services/auth';
import { JourneyRetrievalService } from './../../services/journeyRetrieval';

@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html',
})
export class PreferencesPage {

  private preferences = {
    radius: 0,
    waitTime: 0,
    distance: "km"
  }

  constructor(public navCtrl: NavController,
              private userService: UserService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private authService: AuthService,
              private  journeyService: JourneyRetrievalService) {}

  ionViewDidLoad() {
    this.loadPreferences();
  }

  updateDistance(){
    if(this.preferences.distance == "miles"){
      this.preferences.distance = "km";
    }else{
    this.preferences.distance = "miles"
    }
  }

  savePreferences(){
    const loading = this.loadingCtrl.create({
      content: 'Saving...'
    });
    loading.present();
    this.authService.getActiveUser().getToken().then((token => {
      this.userService.setPreferences(this.preferences);
      this.userService.savePreferences(token, this.preferences)
        .subscribe(
        () => loading.dismiss(),
        error => {
          loading.dismiss();
        }
        );
      this.navCtrl.popToRoot();
    }));
  }

  loadPreferences(){
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.authService.getActiveUser().getIdToken()
      .then(
      (token: string) => {
        this.userService.fetchPreferences(token)
          .subscribe(
          (preferences) => {
            loading.dismiss();
            if (preferences) {
              console.log(preferences);
              this.preferences = preferences
              this.userService.setPreferences(this.preferences);
            } else {
              
            }
          },
          error => {
            loading.dismiss();
            this.handleError(error.json().error);
          }
          );
      });
  }
  resetPreferences(){
    this.preferences.radius = 0;
    this.preferences.distance = "km";
    this.preferences.waitTime = 0;
    this.savePreferences();
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
