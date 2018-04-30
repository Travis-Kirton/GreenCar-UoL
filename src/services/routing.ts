import { AuthService } from './auth';
import { Route } from './../models/route';
import { ToastController } from 'ionic-angular';
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AngularFireDatabase } from 'angularfire2/database';
import  firebase  from 'firebase';

@Injectable()
export class RoutingService {

  private routes: Route[] = [];
  private uid = firebase.auth().currentUser.uid;
  private routeRef = this.afDatabase.list<Route>(this.uid + '/routes');

  constructor(private afDatabase: AngularFireDatabase,
              private toastCtrl: ToastController,
              private authService: AuthService) {
  }

  addRoute(route: Route) {
    console.log(this.uid);
    this.routeRef.push(route);
  }

  disableRoute(key: string, disabled) {
    this.afDatabase.object(this.uid + '/routes/' + key + '/disabled').set(!disabled);
  }

  updateStatus(key: string,journey:Route, status: string){
    console.log(journey);
    this.afDatabase.object(this.uid + '/routes/' + key + '/status').set(status);
  }

  updateJourney(key: string, journey:Route){
    this.afDatabase.object(this.uid + '/routes/' + key).set(journey);
  }

  getRoutes() {
    let uid = firebase.auth().currentUser.uid;
    return this.afDatabase.list<Route>(uid + '/routes');
  }

  getAllRoutes(){
    return this.afDatabase.list<Route>('/');

  }

  removeRoute(key: string) {
    this.routeRef.remove(key);
  }
}
