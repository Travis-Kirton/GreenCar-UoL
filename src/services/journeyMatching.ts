import { Injectable } from '@angular/core';
import { JourneyRetrievalService } from '../services/journeyRetrieval';
import { Route } from '../models/route';
import { MapNode } from '../models/node';
import { UserService } from './user';

/**
 * Author: Travis Kirton
 * Desription: JourneyMatchingService @Service Component
 * Date: 03/05/2018
 */

@Injectable()
export class JourneyMatchingService {

    journeys: any[] = [];
    preferences = this.userService.getPreferences();

    constructor(private jrService: JourneyRetrievalService,
        private userService: UserService) {

        // populate all journeys on page injection
        this.jrService.getJourneys()
            .then(journeys => {
                this.journeys = journeys;
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Find list of closest journeys based on current preferences
    findClosestStartMatch(lat: number, lon: number): object[] {
        this.populateJoureys();
        let matches = this.findClosestJourneyCoords(this.journeys, lat, lon);
        return matches;
    }

    // Refine matches based on Time, Repeating, & Preferences
    matchBasedOnTimeAndPref(suggestedMatches: any[], journey: Route): Route[] {
        let matches: Route[] = [];

        suggestedMatches.forEach((match) => {
            let suggestedDate = new Date(match.startDate);
            let journeyDate = new Date(journey.startDate);

            let suggestedPickUp = match.pickUpTime.split(':');
            suggestedDate.setHours(+suggestedPickUp[0]);
            suggestedDate.setMinutes(+suggestedPickUp[1]);

            let journeyPickUp = journey.pickUpTime.split(':');
            journeyDate.setHours(+journeyPickUp[0]);
            journeyDate.setMinutes(+journeyPickUp[1]);

            // check if route is disabled (don't match if true)
            if (match.disabled == false || (match.users.length < match.seatsAvailable)) {
                // find matches that are starting on/after the same date (unless repeating)
                if (((suggestedDate.getDate() - journeyDate.getDate() >= 0) && !match.repeating) || match.repeating) {
                    let suggestedMinutes = (suggestedDate.getHours() * 60) + suggestedDate.getMinutes();
                    let journeyMinutes = (journeyDate.getHours() * 60) + journeyDate.getMinutes();
                    //check pick-up time & user waiting allowance is compatible
                    let timeDiff = ((suggestedMinutes + this.preferences.waitTime) - journeyMinutes);
                    if (timeDiff >= 0 && timeDiff <= this.preferences.waitTime) {
                        matches.push(match);
                    }
                }
            }
        });
        return matches;
    }

    populateJoureys(){
        this.jrService.getJourneys()
            .then(journeys => {
                this.journeys = journeys;
            })
            .catch(error => {
                console.log(error);
            });
    }



    // Finds closest Nodes
    findClosestNode(arr, lat:number, lon:number): MapNode {
        let newNode = arr[0];
        arr.forEach(node => {
            if (this.calcDistance(lat, lon, node.lat, node.lon) < this.calcDistance(lat, lon, newNode.lat, newNode.lon)) {
                newNode = node;
            }
        });
        return newNode;
    }

    // Finds closest array of journeys
    findClosestJourneyCoords(journeys, lat:number, lon:number): object[] {
        let currLat = 0;
        let currLon = 0;
        let matchedRoutes: object[] = [];
        journeys.forEach(journey => {
            let coords = journey.coords[0];
            if (this.calcDistance(lat, lon, coords[0], coords[1]) < this.preferences.waitTime) {
                matchedRoutes.push(journey);
            }
        });
        return matchedRoutes;
    }

    // Haversine formula for computing distances
    //https://rosettacode.org/wiki/Haversine_formula#JavaScript
    calcDistance(lat1, lon1, lat2, lon2) {
        let R = 3958.75; // (km) - default required
        if (this.preferences.distanceType == "miles") {
            R = 6372.8;   // calculating for miles
        }

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