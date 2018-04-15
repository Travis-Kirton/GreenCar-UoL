import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Journey } from '../models/journey';
import { Route } from '../models/route';

@Injectable()
export class JourneyRetrievalService{

    constructor(){}

    // retrieves all journeys stored in database, including uid, start & end coords
    // used for matching users based on journeys
    getJourneys(): Promise<Array<Journey>>{
        var query = firebase.database().ref("/").orderByKey();
        return query
        .once("value")
        .then(snapshot => {
          const journeys: Journey[] = [];
          snapshot.forEach(snap => {
            if(snap.val().routes != undefined){
                let routes = snap.val().routes;
                routes.forEach(route => {
                    journeys.push({
                        uid: snap.key,
                        start: route.coords[0],
                        end: route.coords[route.coords.length-1],
                        timestamp: route.dateBooked,
                        username: route.username
                    });
                });
            }
            return false;
          });
          return journeys;
      });
    }

    findRouteViaUser(uid, timestamp): Route{
        let route: Route;
        
        return route;
    }


   
    // get start, end, uid of journey & whether rider/driver

}