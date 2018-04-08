import { RoutingService } from './routing';
import { MapNode } from './../models/node';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class NodeStorageService {
  nodes: MapNode[] = [];

  constructor(private http: Http){
    this.getAllNodesFromAPI().subscribe(nodes =>{
      nodes.forEach(node => {
        this.nodes.push(new MapNode(node.id, node.lat, node.lon));
      }),
      () => {console.log("complete");}
    });

  }

  printAllNodes(){
    console.log(this.nodes.length);
  }

  getAllNodesFromAPI() {
    return this.http.get(`http://localhost:4000/allNode`)
    .map((res: Response) => res.json());
  }

  getNodes(): MapNode[]{
    return this.nodes;
  }

  getNode(nodeId: number): MapNode{
    let nodeFound: MapNode;
    this.nodes.forEach(node => {
      if(node.nodeId == nodeId){
        nodeFound = node;
      }
    });
    return nodeFound;
  }

  findClosestNode(lat, lon): number[]{
    let nodes = this.getNodes();
    let current: number[] = [];
    nodes.forEach(node => {
     
    });
    return ;
  }
}
