import { NodeStorageService } from './nodeStorage';
import { Edge } from './../models/edge';
import { RoutingService } from './routing';
import { MapNode } from './../models/node';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class EdgeStorageService {
  edges: Edge[] = [];

  roadNames: Set<string>;

  constructor(private http: Http,
    private nodeSS: NodeStorageService) {
    this.getAllEdgesFromAPI().subscribe(nodes => {
      nodes.forEach(node => {
        this.edges.push(new Edge(node.source, node.target, node.name, node.cost, node.cost_s, node.reverse_cost, node.maxspeed_forward));
      });
    });
  }

  // demonstrate time taken to search edges
  demoSearchingNode() {
    var t0 = performance.now();
    var t1;
    this.edges.forEach(edge => {
      if (edge.source == 20812) {
        t1 = performance.now();
      }
    });
    // averages 1.0-7ms +-2ms to find node within edges
    //console.log(`Time taken to find node: ${(t1-t0)}`);
  }

  // Get all edges as JSON
  getAllEdgesFromAPI() {
    return this.http.get(`http://localhost:4000/allEdge`)
      .map((res: Response) => res.json());
  }

  // Get all edges as Array of Edges
  getEdges(): Edge[] {
    return this.edges;
  }

  getNodeByEdgeName(name: string): number {
    let nodeId: number = 0;
    while (nodeId == 0) {
      this.edges.forEach(edge => {
        if (edge.name == name) {
          nodeId = edge.target;
        }
      });
    }
    return nodeId;
  }

  getEdgeNameByNodeId(node: MapNode): string {
    let edgeName = "Point Not Found";
    this.edges.forEach(edge => {
      // console.log(edge.name);
      if (edge.name != null) {
        if (node.nodeId == edge.source) {
          edgeName = edge.name;
        } else if (node.nodeId == edge.target) {
          edgeName = edge.name;
        }
      }
    });
    return edgeName;
  }

  // return neighbours of node as/when required
  findNeighbours(node: MapNode): MapNode[] {
    let neighbours: MapNode[] = [];
    this.edges.forEach(edge => {
      if (node.nodeId == edge.source) {
        neighbours.push(this.nodeSS.getNode(edge.target));
      } else if (node.nodeId == edge.target) {
        neighbours.push(this.nodeSS.getNode(edge.source));
      }
    });
    return neighbours;
  }

  populateRoadNames() {
    this.roadNames = new Set<string>();
    this.edges.forEach((edge) => {
      if (edge.name != null) {
        this.roadNames.add(edge.name);
      }
    });
  }

  getRoadNames(): string[]{
    return Array.from(this.roadNames);
  }
}
