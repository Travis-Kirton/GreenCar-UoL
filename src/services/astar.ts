import { Injectable } from '@angular/core';
import { MapNode } from './../models/node';
import { RoutingService } from './routing';

@Injectable()
export class Astar {

  openSet: MapNode[];
  closedSet: MapNode[];
  start: MapNode;
  end: MapNode;

  constructor(private routingService: RoutingService) { }

  astar(startNode: number, endNode: number) {
    // create start node based on nodeID
    this.routingService.getNode(startNode).subscribe(node => {
      this.start = new MapNode(node.id, node.lon, node.lat, this.getNodeNeighbours(node.id));
    });

    // push start node onto open set
    this.openSet.push(this.start);

    // keep running until openset is empty
    while (this.openSet.length != 0) {

      let winner = 0;
      for(let i = 0; i < this.openSet.length; i++){
        if(this.openSet[i].f < this.openSet[winner].f){
          winner = i;
        }
      }
      var current  = this.openSet[winner];

      if(current.nodeId == endNode){
        console.log("DONE");
      }

      //remove current node from openSet
      this.removeCurrent(current)
      //add current node to closed set
      this.closedSet.push(current);

    }
  }

  /**Checks current NodeID against edges with it meets,
   * adding nodes on end of edges as neighbours.
   *
   * @param nodeID
   */
  getNodeNeighbours(nodeID: number): MapNode[] {
    let neighbours: MapNode[] = [];
    console.log("---- NEIGHBOURS OF (" + nodeID + ") ----")
    this.routingService.getNodeNeighbours(nodeID).subscribe(node => {
      node.forEach(node => {
        if (nodeID == node.source) {
          // target node of edge added as neighbour
          console.log("neighbour: " + node.target);
          this.routingService.getNode(node.target).subscribe(node => {
            neighbours.push(node);
          });

        } else if (nodeID == node.target) {
          // source node of edge added as neighbour
          console.log("neighbour: : " + node.source)
          this.routingService.getNode(node.source).subscribe(node => {
            neighbours.push(node);
          });
        }
      });
    });
    return neighbours;
  }

  heuristic_cost_estimate(start: number, end: number){
    // estimate heuristics
  }

  removeCurrent(current: MapNode){
    for(let i = this.openSet.length-1; i >= 0; i--){
      if(this.openSet[i].nodeId == current.nodeId){
        this.openSet.splice(i, 1);
      }
    }
  }
}
