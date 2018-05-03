import { RoutingService } from './routing';
import { MapNode } from './../models/node';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Route } from '../models/route';

/**
 * Author: Travis Kirton
 * Desription: NodeStorageService @Service Component
 * Date: 03/05/2018
 */

@Injectable()
export class NodeStorageService {
  nodes: MapNode[] = [];

  constructor(private http: Http) {
    // Populate list of nodes from API Call
    this.getAllNodesFromAPI().subscribe(nodes => {
      nodes.forEach(node => {
        this.nodes.push(new MapNode(node.id, node.lat, node.lon));
      })
    });

  }

  // return all nodes from API
  getAllNodesFromAPI() {
    return this.http.get(`http://localhost:4000/allNode`)
      .map((res: Response) => res.json());
  }

  getNodes(): MapNode[] {
    return this.nodes;
  }


  // Get Single Node based on NodeID
  getNode(nodeId: number): MapNode {
    let nodeFound: MapNode;
    this.nodes.forEach(node => {
      if (node.nodeId == nodeId) {
        nodeFound = node;
      }
    });
    return nodeFound;
  }
}
