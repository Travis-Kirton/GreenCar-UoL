import { Injectable } from '@angular/core';
import { Route } from '../models/route';

@Injectable()
export class JourneyJoiningService{

    // handles incoming request to join a journey
    reqToJoin(route: Route){
        console.log(route);
        route.setStatus("pending");
    }
    // sends a notification to users
    notifyUser(){

    }

}