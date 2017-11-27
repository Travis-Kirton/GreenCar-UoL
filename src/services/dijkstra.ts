import { Graph } from './../models/graph';
import { Edge } from './../models/edge';
import { EdgeStorageService } from './edgeStorage';
import { NodeStorageService } from './nodeStorage';
import { Injectable } from '@angular/core';
import { MapNode } from './../models/node';
import { RoutingService } from './routing';

@Injectable()
export class Dijkstra {
  source: MapNode;
  target: MapNode;

  nodes: MapNode[];
  edges: Edge[];
  graph: Graph;

  settledNodes: Set<MapNode>;
  unsettledNodes: Set<MapNode>;

  predecessors: Map<MapNode, MapNode>;
  distance: Map<MapNode, number>;



  constructor(private nSS: NodeStorageService,
    private eSS: EdgeStorageService) {
    //creates copies of graph arrays to work with
    this.graph = new Graph(nSS, eSS);
    this.nodes = this.graph.getVertexes();
    this.edges = this.graph.getEdges();
  }

  performDijkstras(source: number, target: number) {
    console.log(this.nodes.length);
    this.source = this.graph.getNode(source);
    this.target = this.graph.getNode(target);

    this.execute(this.source);
  }

  execute(source: MapNode) {
    this.settledNodes = new Set<MapNode>();
    this.unsettledNodes = new Set<MapNode>();

    this.distance = new Map<MapNode, number>();
    this.predecessors = new Map<MapNode, MapNode>();

    this.distance.set(source, 0);
    this.unsettledNodes.add(source)
    let t0 = performance.now();
    while (this.unsettledNodes.size > 0) {
      let node = this.getMinimum(this.unsettledNodes);
      this.settledNodes.add(node);
      this.unsettledNodes.delete(node);
      this.findMinimalDistances(node);
      if(node.nodeId == this.target.nodeId) break;
    }
    let t1 = performance.now();
    console.log("DONE");
    console.log(`Completed in: ${(t1-t0)}ms`);
  }

  findMinimalDistances(node: MapNode) {
    let adjacentNodes = this.getNeighbours(node);
    adjacentNodes.forEach(target => {
      if (this.getShortestDistance(target) > this.getShortestDistance(node) + this.getDistance(node, target)) {
        this.distance.set(target, this.getShortestDistance(node) + this.getDistance(node, target));
        this.predecessors.set(target, node);
        this.unsettledNodes.add(target);
      }
    });
  }

  getDistance(node: MapNode, target: MapNode): number {
    let neighbours: MapNode[] = [];
    this.edges.forEach(edge => {
      if (edge.source == node.nodeId && edge.target == target.nodeId) {
        return edge.cost;
      }
    });
    return null;
  }

  getNeighbours(node: MapNode): MapNode[] {
    let neighbours: MapNode[] = [];
    this.edges.forEach(edge => {
      if (edge.source == node.nodeId && !this.isSettled(edge.target)) {
        neighbours.push(this.graph.getNode(edge.target))
      }
    });
    return neighbours;
  }

  getMinimum(vertexes: Set<MapNode>): MapNode {
    let minimum: MapNode = null;
    vertexes.forEach(vertex => {
      if (minimum == null) {
        minimum = vertex;
      } else {
        if (this.getShortestDistance(vertex) < this.getShortestDistance(minimum)) {
          minimum = vertex;
        }
      }
    });
    return minimum;
  }

  isSettled(nodeId: number): boolean {
    let contains: boolean = false;
    this.unsettledNodes.forEach(vertex => {
      if(vertex.nodeId == nodeId){
        contains = true;
      }
    });
    return contains;
  }

  getShortestDistance(destination: MapNode): number {
    let d = this.distance.get(destination);
    if (d == null) {
      return Number.MAX_VALUE;
    } else {
      return d;
    }
  }

  getPath(target: MapNode): MapNode[] {
    let path: MapNode[] = [];
    let step = target;
    // check if a path exists
    if (this.predecessors.get(step) == null) {
      return null;
    }
    path.push(step);
    while (this.predecessors.get(step) != null) {
      step = this.predecessors.get(step);
      path.push(step);
    }

    //Order correctly
    path.reverse();
    return path;
  }

}
