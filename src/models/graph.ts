import { EdgeStorageService } from './../services/edgeStorage';
import { NodeStorageService } from './../services/nodeStorage';
import { Edge } from './edge';
import { MapNode } from './node';
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
}
