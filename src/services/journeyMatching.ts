import { Injectable } from '@angular/core';
import { JourneyRetrievalService } from '../services/journeyRetrieval';
import { Route } from '../models/route';
import { NodeStorageService } from '../services/nodeStorage';
import { MapNode } from '../models/node';

@Injectable()
export class JourneyMatchingService {

    routes: Route[] = [];

    constructor(private jrService: JourneyRetrievalService,
                private nodeStorageService: NodeStorageService) {
        // this.jrService.getJourneys()
        //     .then(journeys => {
        //         this.journeys = journeys;
        //         console.log(this.journeys);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });     
        }

    findClosestStartMatch(lat: number, lon: number){
       // let match = this.nodeStorageService.findClosestJourneyCoords(this.journeys, lat, lon);
       // return match;
    }



}