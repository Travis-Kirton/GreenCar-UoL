import { Injectable } from '@angular/core';
import { JourneyRetrievalService } from '../services/journeyRetrieval';
import { Route } from '../models/route';
import { MapNode } from '../models/node';

@Injectable()
export class JourneyMatchingService {

    journeys: object[] = [];
    distance: number;
    distanceType: string;

    constructor(private jrService: JourneyRetrievalService) {
        this.jrService.getJourneys()
            .then(journeys => {
                this.journeys = journeys;
                console.log(this.journeys);
            })
            .catch(error => {
                console.log(error);
            });
    }

    findClosestStartMatch(lat: number, lon: number) {
        let match = this.findClosestJourneyCoords(this.journeys, lat, lon);
        return match;
    }


    findClosestNode(arr, lat, lon): MapNode {
        let newNode = arr[0];
        arr.forEach(node => {
            if (this.calcDistance(lat, lon, node.lat, node.lon) < this.calcDistance(lat, lon, newNode.lat, newNode.lon)) {
                newNode = node;
            }
        });
        return newNode;
    }

    findClosestJourneyCoords(journeys, lat, lon): object[] {
        let currLat = 0;
        let currLon = 0;
        let matchedRoutes: object[];
        journeys.forEach(journey => {
            let coords = journey.journey.coords[0];
            if (this.calcDistance(lat, lon, coords[0], coords[1]) < this.calcDistance(lat, lon, currLat, currLon)) {
                currLat = coords[0];
                currLon = coords[1];
                matchedRoutes.push(journey);
            }
        });
        return matchedRoutes;
    }

    // Haversine formula for computing distances
    //https://rosettacode.org/wiki/Haversine_formula#JavaScript
    calcDistance(lat1, lon1, lat2, lon2) {
        let R = 3958.75; // Miles = 3958.75, KM = 6372.8
        let dLat = this.toRad(lat2 - lat1);
        let dLon = this.toRad(lon2 - lon1);
        lat1 = this.toRad(lat1);
        lat2 = this.toRad(lat2);

        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1)
            * Math.cos(lat2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return d
    }

    // convert values to Radians
    toRad(value) {
        return value * Math.PI / 100;
    }



}