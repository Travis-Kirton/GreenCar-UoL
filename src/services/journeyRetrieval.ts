import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Journey } from '../models/journey';

@Injectable()
export class JourneyRetrievalService{

    constructor(){}

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
                        end: route.coords[route.coords.length-1]
                    });
                });
            }
            return false;
          });
          return journeys;
      });
    }


   
    // get start, end, uid of journey & whether rider/driver

}