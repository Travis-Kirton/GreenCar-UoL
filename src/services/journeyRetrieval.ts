import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Route } from '../models/route';
import { Http, Response } from "@angular/http";
import { AuthService } from './auth';
import { Observable } from 'rxjs/Observable';
import { RoutingService } from './routing';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class JourneyRetrievalService {

    constructor(private http: Http,
        private authService: AuthService,
        private routingService: RoutingService,
        private afDatabase: AngularFireDatabase) {
        this.routes = this.routingService
            .getAllRoutes() // DB List
            .snapshotChanges() // Key:Value pairs
            .map(changes => {
                return changes.map(c => ({
                    key: c.payload.key,
                    ...c.payload.val()
                }));
            });
    }

    //routes: object[] = [];
    routes: Observable<any[]>;
    return_routes: Route[];
    uid = this.authService.getActiveUser().uid;

    // retrieves all journeys stored in database, including uid, start & end coords
    // used for matching users based on journeys
    getJourneys() {
        let routeArray: any[] = [];
        this.return_routes = [];
        var query = firebase.database().ref("/").orderByKey();
        return query
            .once("value")
            .then(snapshot => {
                snapshot.forEach(snap => {
                    if (snap.val().routes != undefined) {
                           // don't suggest users journeys own journeys
                            if (this.uid != snap.key) {
                                routeArray.push(snap.val().routes = Object.keys(snap.val().routes).map(key => {
                                    return snap.val().routes[key];
                                }));
                                routeArray.forEach(route2 => {
                                    route2.forEach(innerRoute => {
                                        this.return_routes.push(innerRoute);
                                    })
                                });
                             }
                    }
                    return false;
                });
                return this.return_routes;
            });
    }



    getSpecificJourney(token, uid) {
        let route_toReturn: Route;
        return this.http.get('https://greencar-uol.firebaseio.com/' + uid + '/routes.json?auth=' + token)
            .map((response: Response) => {
                return response.json();
            });

    }


}