import { Graph } from './../models/graph';
import { Edge } from './../models/edge';
import { EdgeStorageService } from './edgeStorage';
import { NodeStorageService } from './nodeStorage';
import { Injectable } from '@angular/core';
import { MapNode } from './../models/node';
import { RoutingService } from './routing';

@Injectable()
export class Astar {

  openSet: MapNode[] = [];
  closedSet: MapNode[] = [];

  nodes: MapNode[];
  edges: Edge[];
  graph: Graph;

  nodeJSON: any;

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

      let current = this.openSet[winner];
      //find neighours of currentNode
      current.neighbours = this.eSS.findNeighbours(current);

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

          neighbour.h = this.heuristic(neighbour, this.end);

          // add where this node came from
          neighbour.previous = current;
        }
      });
    }
  }

  heuristic(node: MapNode, end: MapNode): number {
    // Haversine formula to compute distance between 2 lat/lng points
    let dist: number = 0;

    var R = 6371 // km
    var dLat = this.toRadians(this.end.lat - node.lat);
    var dLon = this.toRadians(this.end.lon - node.lon);
    var lat1 = this.toRadians(node.lat);
    var lat2 = this.toRadians(this.end.lat);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    dist = R * c;

    return dist;
  }

  toRadians(value){
    return value * Math.PI / 180;
  }

  removeCurrent(current: MapNode) {
    for (let i = this.openSet.length - 1; i >= 0; i--) {
      if (this.openSet[i].nodeId == current.nodeId) {
        this.openSet.splice(i, 1);
      }
    }
  }

  // Check for existence of node within a set (array)
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
