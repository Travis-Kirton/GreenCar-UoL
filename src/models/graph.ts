import { EdgeStorageService } from './../services/edgeStorage';
import { NodeStorageService } from './../services/nodeStorage';
import { Edge } from './edge';
import { MapNode } from './node';

/**
 * Author: Travis Kirton
 * Desription: Graph Model
 * Date: 03/05/2018
 */

export class Graph{

  vertexes: MapNode[];
  edges: Edge[];

  constructor(private nSS: NodeStorageService,
              private eSS: EdgeStorageService){
    this.vertexes = this.nSS.getNodes();
    this.edges = this.eSS.getEdges();
  }

  getVertexes(): MapNode[]{
    return this.vertexes;
  }

  getEdges(): Edge[]{
    return this.edges;
  }

  getNode(nodeId: number): MapNode{
    return this.nSS.getNode(nodeId);
  }

  getNodeByName(name: string): MapNode{
    let node = this.eSS.getNodeByEdgeName(name);
    return this.nSS.getNode(node);
  }
}
