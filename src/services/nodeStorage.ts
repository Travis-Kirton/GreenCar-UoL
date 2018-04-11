import { RoutingService } from './routing';
import { MapNode } from './../models/node';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

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

  printAllNodes() {
    console.log(this.nodes.length);
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

  findClosestCoords(arr, lat, lon): number[] {
    let currLat = 0;
    let currLon = 0;
    console.log(arr);
    arr.forEach(node => {
      if(this.calcDistance(lat,lon, node.lat, node.lon) < this.calcDistance(lat, lon, currLat, currLon)){
        currLat = node.lat;
        currLon = node.lon;
      }
    });
    return [currLat, currLon];
    
  }


  // Haversine formula for computing distances
  //https://rosettacode.org/wiki/Haversine_formula#JavaScript
  calcDistance(lat1, lon1, lat2, lon2){
    let R = 6371;
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
