import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController } from 'ionic-angular';
import { JourneyRetrievalService } from '../../services/journeyRetrieval';
import { Route } from '../../models/route';
import { AuthService } from '../../services/auth';
import { PopoverHomePage } from '../popover-home/popover-home';
import { RoutingService } from '../../services/routing';

@Component({
  selector: 'page-matched-journey',
  templateUrl: 'matched-journey.html',
})
export class MatchedJourneyPage {

  private journey: any = undefined;
  private commentText: string = "";
  private uid =this.navParams.get('route').matchedRoute.uid;

  constructor(private authService: AuthService,
    private routingService: RoutingService,
    private popCtrl: PopoverController,
    private navParams: NavParams,
    private jrService: JourneyRetrievalService,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadRoute();
  }


  loadRoute(){ 
    console.log(this.uid);
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

  userOptions(user){
    let popover = this.popCtrl.create(PopoverHomePage);
    popover.present();
  }

  postComment(){
    this.routingService.addComment(this.uid, this.journey, this.commentText);
    this.commentText = " ";
  }

}
