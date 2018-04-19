import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Route } from '../models/route';

@Injectable()
export class JourneyRetrievalService {

    constructor() { }

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

    // findRouteViaUser(uid, timestamp): Route {
    //     let route_return: Route;
    //     this.routes.forEach(route)
    //     return route;
    // }


}