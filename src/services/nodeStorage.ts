import { RoutingService } from './routing';
import { MapNode } from './../models/node';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Journey } from '../models/journey';

@Injectable()
export class NodeStorageService {
  nodes: MapNode[] = [];

  constructor(private http: Http) {
    this.getAllNodesFromAPI().subscribe(nodes => {
      nodes.forEach(node => {
        this.nodes.push(new MapNode(node.id, node.lat, node.lon));
      }),
        () => { console.log("complete"); }
    });

  }

  getAllNodesFromAPI() {
    return this.http.get(`http://localhost:4000/allNode`)
      .map((res: Response) => res.json());
  }

  getNodes(): MapNode[] {
    return this.nodes;
  }

  getNode(nodeId: number): MapNode {
    let nodeFound: MapNode;
    this.nodes.forEach(node => {
      if (node.nodeId == nodeId) {
        nodeFound = node;
      }
    });
    return nodeFound;
  }

  findClosestNode(arr, lat, lon): MapNode {
    let newNode = arr[0];
    arr.forEach(node => {
      if(this.calcDistance(lat,lon, node.lat, node.lon) < this.calcDistance(lat, lon, newNode.lat, newNode.lon)){
        newNode = node;
      }
    });
    return newNode;
    
  }

  findClosestJourneyCoords(arr: Journey[], lat, lon): Journey {
    let currLat = 0;
    let currLon = 0;
    let matchedJourney: Journey;
    arr.forEach(journey => {
      let coords = journey.start;
      if(this.calcDistance(lat,lon, coords[0], coords[1]) < this.calcDistance(lat, lon, currLat, currLon)){
        currLat = coords[0];
        currLon = coords[1];
        matchedJourney = journey;
      }
    });
    //console.log(matchedJourney.userName);
    return matchedJourney;
    
  }


  // Haversine formula for computing distances
  //https://rosettacode.org/wiki/Haversine_formula#JavaScript
  calcDistance(lat1, lon1, lat2, lon2){
    let R = 3958.75; // Miles = 3958.75, KM = 6372.8
    let dLat = this.toRad(lat2-lat1);
    let dLon = this.toRad(lon2-lon1);
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1)
      * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    return d
   }

  // convert values to Radians
  toRad(value){
    return value * Math.PI / 100;
  }
}
