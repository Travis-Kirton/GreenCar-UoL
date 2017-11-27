import { EdgeStorageService } from './edgeStorage';
import { NodeStorageService } from './nodeStorage';
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

  path: MapNode[] = [];

  constructor(private routingService: RoutingService,
              private nSS: NodeStorageService,
              private eSS: EdgeStorageService) { }

  // 20812 -> 17305
  astar(startNode: number, endNode: number) {
    //add start node to open set
    this.start = this.nSS.getNode(startNode);
    this.start.neighbours = this.eSS.findNeighbours(this.start);
    this.openSet.push(this.start);
    console.log(this.openSet);

    // keep running until openset is empty
    while (this.openSet.length > 0) {

      let winner = 0;
      for (let i = 0; i < this.openSet.length; i++) {
        console.log("openSet g: " + this.openSet[i].g);
        console.log("curr winner g: " + this.openSet[winner].g);
        if (this.openSet[i].g < this.openSet[winner].g) {
          console.log("g is less than current g");
          winner = i;
        }
      }

      let current = this.openSet[winner];

      if (current.nodeId == endNode) {
        console.log("DONE");

        //Find the path
        this.path = [];
        let temp = current;
        this.path.push(temp);
        while (temp.previous) {
          this.path.push(temp.previous)
          temp = temp.previous;
        }
      }

      //remove current node from openSet
      this.removeCurrent(current)
      //add current node to closed set
      this.closedSet.push(current);
      console.log(current.neighbours.length);

      // for each neighbour of current
      let neighbours = current.neighbours;
      console.log(neighbours.length);


      neighbours.forEach(async neighbour => {
        console.log(neighbour.nodeId);
        // if closed set doesn't includes neighbour
        if (this.includes(neighbour.nodeId, this.closedSet) === false) {
          console.log("closed doesn't have neighbour");
          let tempG = current.g + neighbour.g;

          if (this.includes(neighbour.nodeId, this.openSet) === true) {
            console.log("open has neighbour");
            if (tempG < neighbour.g) {
              neighbour.g = tempG;
            }
          } else {
            console.log("Adding neighbours to neighbour");
            neighbour.g = tempG;
            console.log("added neighbours to neighbour");
            //await this.createNodeInOpenSet(neighbour.nodeId);
            console.log("added to openSet: " + neighbour);
          }

          //requires more research
          //neighbour.h = this.heuristic(neighbour, this.end);

          // add where this node came from
          neighbour.previous = current;
        }
      });
    }
  }

  heuristic(node: MapNode, end: MapNode): number {
    // Euclidean distance
    let dist: number = 0;
    return dist;
  }

  removeCurrent(current: MapNode) {
    for (let i = this.openSet.length - 1; i >= 0; i--) {
      if (this.openSet[i].nodeId == current.nodeId) {
        this.openSet.splice(i, 1);
      }
    }
  }

  /**Check for existence of node within a set (array)
   *
   * @param nodeId
   * @param set
   */
  includes(nodeId: number, set: MapNode[]): boolean {
    console.log("checking for" + nodeId);
    let includes: boolean = false;
    for (let i = 0; i < set.length - 1; i++) {
      if (set[i].nodeId === nodeId) {
        includes = true;
      }
    }
    return includes;
  }

  getPathFound() {
    for (let i = 0; i < this.path.length; i++) {
      console.log(this.path[i].nodeId);
    }
  }

}
