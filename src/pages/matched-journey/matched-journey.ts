import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { JourneyRetrievalService } from '../../services/journeyRetrieval';
import { Route } from '../../models/route';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-matched-journey',
  templateUrl: 'matched-journey.html',
})
export class MatchedJourneyPage {

  private journey: any = undefined;

  constructor(private authService: AuthService,
    private navParams: NavParams,
    private jrService: JourneyRetrievalService,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadRoute();
  }


  loadRoute(){
    
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.authService.getActiveUser().getIdToken()
    .then((token: string) => {
      this.jrService.getSpecificJourney(token, this.navParams.get('route').matchedRoute.uid)
        .subscribe(
          (routes: Route[]) => {
            if (routes) {
              routes.forEach(route => {
                if (route.dateBooked == this.navParams.get('route').matchedRoute.journey.dateBooked) {
                  this.journey = route;
                  console.log(this.journey);
                  loading.dismiss();
                }
              });
            }
          },
          error => {
            loading.dismiss();
            console.log(error);
          }
        );
    });
  }

}
