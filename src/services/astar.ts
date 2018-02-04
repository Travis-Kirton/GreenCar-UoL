import { Graph } from './../models/graph';
import { Edge } from './../models/edge';
import { BinaryHeap } from './../dataStructures/BinaryHeap';
import { EdgeStorageService } from './edgeStorage';
import { NodeStorageService } from './nodeStorage';
import { Injectable } from '@angular/core';
import { MapNode } from './../models/node';

@Injectable()
export class Astar {

  openSet: BinaryHeap;
  closedSet: BinaryHeap;

  nodes: MapNode[];
  edges: Edge[];
  graph: Graph;

  end: MapNode;
  start: MapNode;

  path: MapNode[] = [];

  constructor(private nSS: NodeStorageService,
    private eSS: EdgeStorageService) {
    //creates copies of graph arrays to work with
    this.graph = new Graph(nSS, eSS);
    this.nodes = this.graph.getVertexes();
    this.edges = this.graph.getEdges();
  }

  heap():BinaryHeap {
    return new BinaryHeap(function(node:MapNode) {
      return node.f;
    });
  }

  // 20812 -> 17305
  performAstar(source: string, target: string) {

    return new Promise((resolve => {
      this.openSet = this.heap();
      this.closedSet = this.heap();

      //add start node to open set
      this.start = this.graph.getNodeByName(source);
      this.end = this.graph.getNodeByName(target);
      this.start.neighbours = this.eSS.findNeighbours(this.start);
      this.openSet.push(this.start);

      //keep running until openset is empty
      let t0 = performance.now(); //performance start
      while (this.openSet.size() > 0) {

        let winner = 0;

        let current = this.openSet.pop();

        //find neighours of currentNode
        current.neighbours = this.eSS.findNeighbours(current);

        if (current.nodeId == this.end.nodeId) {
          console.log("DONE");
          break; // found target node
        }

        //remove current node from openSet
        this.openSet.remove(current);

        //add current node to closed set
        this.closedSet.push(current);

        // for each neighbour of current
        let neighbours = current.neighbours;


        neighbours.forEach(neighbour => {
          if (!this.includes(neighbour.nodeId, this.closedSet)) {
            var tempG = current.g + this.getDistance(current, neighbour);

            if (this.includes(neighbour.nodeId, this.openSet)) {
              if (tempG < neighbour.g) {
                neighbour.g = tempG;
              }
            } else {
              neighbour.g = tempG;
              this.openSet.push(neighbour);
            }

            neighbour.h = this.heuristic(neighbour, this.end);
            neighbour.f = neighbour.g + neighbour.h;
            neighbour.previous = current;
          }
        });
      }
      let t1 = performance.now();
      console.log(`A-Star Completed in: ${(t1 - t0)}ms`);
      resolve(true);
    }));
  }

  heuristic(node: MapNode, end: MapNode): number {
    //let dist: number = 0;
    //havensine formula
    // var R = 6371 // km
    // var dLat = this.toRadians(this.end.lat - node.lat);
    // var dLon = this.toRadians(this.end.lon - node.lon);
    // var lat1 = this.toRadians(node.lat);
    // var lat2 = this.toRadians(this.end.lat);

    // var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    // dist = R * c;
    //return dist;

    //manhattan
    // var D = 1;
    // var D2 = Math.sqrt(2);
    // var d1 = Math.abs(end.lat - node.lat);
    // var d2 = Math.abs(end.lon - node.lon);
    // return (dist * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1,d2));

    //euclidian
    var deglen = 110.25;
    var x = node.lat - end.lat;
    var y = (node.lon - end.lon) * Math.cos((end.lat));
    return deglen * Math.sqrt(x*x + y*y);

  }

  toRadians(value) {
    return value * Math.PI / 180;
  }

  removeCurrent(current: MapNode) {
    // for (let i = this.openSet.size - 1; i >= 0; i--) {
    //   if (this.openSet[i].nodeId == current.nodeId) {
    //     this.openSet.splice(i, 1);
    //   }
    // }
  }

  // Check for existence of node within a set (array)
  includes(nodeId: number, set: BinaryHeap): boolean {
    let includes: boolean = false;
    for (let i = 0; i < set.size() - 1; i++) {
      if (set.content[i].nodeId === nodeId) {
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

  getDistance(node: MapNode, target: MapNode): number {
    this.edges.forEach(edge => {
      if (edge.source == node.nodeId && edge.target == target.nodeId) {
        return edge.cost;
      }
    });
    return null;
  }

}
