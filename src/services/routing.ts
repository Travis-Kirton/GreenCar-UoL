import { AuthService } from './auth';
import { Route } from './../models/route';
import { ToastController } from 'ionic-angular';
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AngularFireDatabase } from 'angularfire2/database';
import firebase  from 'firebase';

/**
 * Author: Travis Kirton
 * Desription: RoutingService @Service Component
 * Date: 03/05/2018
 */

@Injectable()
export class RoutingService {

  private routes: Route[] = [];
  private uid = firebase.auth().currentUser.uid;
  // Create DB References to  current user routes in Firebase
  private routeRef = this.afDatabase.list<Route>(this.uid + '/routes');

  constructor(private afDatabase: AngularFireDatabase,
              private toastCtrl: ToastController,
              private authService: AuthService) {
  }

  addRoute(route: Route) {
    this.routeRef.push(route);
  }

  // Set specific value of route
  disableRoute(key: string, disabled) {
    this.afDatabase.object(this.uid + '/routes/' + key + '/disabled').set(!disabled);
  }

  updateStatus(key: string,journey:Route, status: string){
    this.afDatabase.object(this.uid + '/routes/' + key + '/status').set(status);
  }

  // Set Journey in DB to new Journey being passed in
  updateJourney(key: string, journey:Route){
    this.afDatabase.object(this.uid + '/routes/' + key).set(journey);
  }

  updateUserJourney(uid: string, key: string, journey:Route){
    this.afDatabase.object(uid + '/routes/' + key).set(journey);

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

  removeUser(journey: any, userIndex){
    journey.users.splice(userIndex, 1);
    this.updateJourney(journey.key, journey);  
  }
    
}
