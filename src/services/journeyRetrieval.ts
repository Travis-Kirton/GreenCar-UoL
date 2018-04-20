import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Route } from '../models/route';
import { Http, Response } from "@angular/http";
import { AuthService } from './auth';


@Injectable()
export class JourneyRetrievalService {

    constructor(private http: Http,
                private authService: AuthService) { }

    routes: object[] = [];

    // retrieves all journeys stored in database, including uid, start & end coords
    // used for matching users based on journeys
    getJourneys(): Promise<Array<object>> {
        var query = firebase.database().ref("/").orderByKey();
        return query
            .once("value")
            .then(snapshot => {
                snapshot.forEach(snap => {
                    if (snap.val().routes != undefined) {
                        snap.val().routes.forEach((route) => {
                            this.routes.push({uid: snap.key, journey: route});
                        });
                    }
                    return false;
                });
                return this.routes;
            });
    }

    getSpecificJourney(token, uid){
    let route_toReturn: Route;
    return this.http.get('https://greencar-uol.firebaseio.com/' + uid + '/routes.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      });
    }


}