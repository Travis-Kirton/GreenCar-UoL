import { Injectable } from '@angular/core';
import { JourneyRetrievalService } from '../services/journeyRetrieval';
import { Journey } from '../models/journey';
import { NodeStorageService } from '../services/nodeStorage';
import { MapNode } from '../models/node';

@Injectable()
export class JourneyMatchingService {

    journeys: Journey[] = [];

    constructor(private jrService: JourneyRetrievalService,
                private nodeStorageService: NodeStorageService) {
        this.jrService.getJourneys()
            .then(journeys => {
                this.journeys = journeys;
                console.log(this.journeys);
            })
            .catch(error => {
                console.log(error);
            });     
    
        }

    findClosestStartMatch(journeys: Journey[], lat: number, lon: number){
        let match = this.nodeStorageService.findClosestCoords(journeys, lat, lon);
        console.log(match);
    }



}