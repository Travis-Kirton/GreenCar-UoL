import { Injectable } from '@angular/core';
import { MapNode } from './../models/node';
import { RoutingService } from './routing';

@Injectable()
export class Astar {

  openSet: MapNode[] = [];
  closedSet: MapNode[] = [];

  nodeJSON: any;

  end: MapNode;
  start: MapNode;

  constructor(private routingService: RoutingService) { }

  async astar(startNode: number, endNode: number) {
    //get starting node from service and create Node from it

    await this.createNodeInOpenSet(startNode);
    console.log("second!");
    console.log(this.openSet);


    // keep running until openset is empty
    while (this.openSet.length > 2) {

      let winner = 0;
      console.log(this.openSet[0].nodeId);
      // for(let i = 0; i < this.openSet.length-1; i++){
      //   if(this.openSet[i].f < this.openSet[winner].f){
      //     winner = i;
      //   }
      // }
      //var current  = this.openSet[winner];

      // if(current.nodeId == endNode){
      //   console.log("DONE");
      // }

      //remove current node from openSet
      //this.removeCurrent(current)
      //add current node to closed set
      //this.closedSet.push(current);

    }
  }

  heuristic_cost_estimate(start: number, end: number) {
    // estimate heuristics
  }

  removeCurrent(current: MapNode) {
    for (let i = this.openSet.length - 1; i >= 0; i--) {
      if (this.openSet[i].nodeId == current.nodeId) {
        this.openSet.splice(i, 1);
      }
    }
  }

  async createNodeInOpenSet(nodeId){
    await this.routingService.getNode(nodeId).then(node => {
      node.forEach(node => {
        this.openSet.push( new MapNode(node.id, node.lat, node.lon, this.routingService.getNodeNeighbours(nodeId)));
      });
    });
  }
}
