import { NodeStorageService } from './nodeStorage';
import { Edge } from './../models/edge';
import { RoutingService } from './routing';
import { MapNode } from './../models/node';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class EdgeStorageService {
  edges: Edge[] = [];

  constructor(private http: Http,
              private nodeSS: NodeStorageService){
    this.getAllEdgesFromAPI().subscribe(nodes =>{
      nodes.forEach(node => {
        this.edges.push(new Edge(node.source, node.target, node.cost, node.reverse_cost));
      }),
      () => {console.log("complete");}
    });

  }

  // demonstrate time taken to search edges
  demoSearchingNode(){
    var t0 = performance.now();
    var t1;
    this.edges.forEach(edge => {
      if(edge.source == 20812){
         t1 = performance.now();
      }
    });
    // averages 1.0-7ms +-2ms to find node within edges
    console.log(`Time taken to find node: ${(t1-t0)}`);
  }

  // Get all edges as JSON
  getAllEdgesFromAPI() {
    return this.http.get(`http://localhost:4000/allEdge`)
    .map((res: Response) => res.json());
  }

  // Get all edges as Array of Edges
  getEdges(): Edge[]{
    return this.edges;
  }

  // return neighbours of node as/when required
  findNeighbours(node: MapNode): MapNode[]{
    let neighbours: MapNode[] = [];
    this.edges.forEach(edge => {
      if(node.nodeId == edge.source){
        neighbours.push(this.nodeSS.getNode(edge.target));
      }else if(node.nodeId == edge.target){
        neighbours.push(this.nodeSS.getNode(edge.source));
      }
    });
    return neighbours;
  }
}
