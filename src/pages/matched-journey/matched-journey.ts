import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController } from 'ionic-angular';
import { JourneyRetrievalService } from '../../services/journeyRetrieval';
import { Route } from '../../models/route';
import { AuthService } from '../../services/auth';
import { PopoverHomePage } from '../popover-home/popover-home';
import { RoutingService } from '../../services/routing';
import { CommentService } from '../../services/commentService';
import { Observable } from 'rxjs/Observable';
import { CommentMessage } from '../../models/comment';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';


@Component({
  selector: 'page-matched-journey',
  templateUrl: 'matched-journey.html',
})
export class MatchedJourneyPage {

  private journey: any = undefined;
  private commentText: string = "";
  private uid = this.navParams.get('route').matchedRoute.uid;
  private driverRoutes: Route[];
  private journeyKey: string;

  private commentList$: Observable<CommentMessage[]>;


  constructor(private authService: AuthService,
    private commentService: CommentService,
    private routingService: RoutingService,
    private popCtrl: PopoverController,
    private navParams: NavParams,
    private jrService: JourneyRetrievalService,
    private loadingCtrl: LoadingController,
    private afDatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.loadRoute();
  }


  loadRoute() {
    var query = firebase.database().ref(this.navParams.get('route').matchedRoute.uid + '/routes/').orderByKey();
    return query
      .once("value")
      .then(snapshot => {
        snapshot.forEach(snap => {
          console.log(snap.key);
          if (snap.val().dateBooked == this.navParams.get('route').matchedRoute.dateBooked) {
            this.journey = snap.val();
            this.journeyKey = snap.key;

            this.commentList$ = this.commentService
              .getComments(this.navParams.get('route').matchedRoute.uid, this.journeyKey) // DB List
              .snapshotChanges() // Key:Value pairs
              .map(changes => {
                return changes.map(c => ({
                  key: c.payload.key,
                  ...c.payload.val()
                }));
              });
          }
        });
      });

  }

  userOptions(user) {
    let popover = this.popCtrl.create(PopoverHomePage);
    popover.present();
  }

  postComment() {
    this.commentService.addComment(this.journeyKey, this.commentText, this.uid).then(ref => {
    });
    this.commentText = ' ';
  }

  ngOnDestroy(){
    this.commentList$.subscribe().unsubscribe();
  }

}
