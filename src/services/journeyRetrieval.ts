import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Route } from '../models/route';

@Injectable()
export class JourneyRetrievalService{

    constructor(){}

    // retrieves all journeys stored in database, including uid, start & end coords
    // used for matching users based on journeys
    getJourneys(): Promise<Array<Route>>{
        var query = firebase.database().ref("/").orderByKey();
        return query
        .once("value")
        .then(snapshot => {
          const routes: Route[] = [];
          snapshot.forEach(snap => {
            if(snap.val().routes != undefined){
                let routes = snap.val().routes;
                routes.forEach(route => {
                    routes.push(route);
                });
            }
            return false;
          });
          return routes;
      });
    }

    findRouteViaUser(uid, timestamp): Route{
        let route: Route;     
        return route;
    }
}