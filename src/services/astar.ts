import { MapNode } from './../models/node';
import { RoutingService } from './routing';

export class Astar {

  openSet = new Set();
  closedSet = new Set();
  start: MapNode;
  end: MapNode;

  constructor(private routingService: RoutingService) { }

  astar(startNode: number, endNode: number) {
    // create start node based on nodeID
    this.routingService.getNode(startNode).subscribe(node => {
      this.start = new MapNode(node.id, node.lon, node.lat, this.getNodeNeighbours(node.id));
    });

    // push start node onto open set
    this.openSet.add(this.start);

    // keep running until openset is empty
    while (this.openSet.size != 0) {

    }

  }

  getNodeNeighbours(nodeID: number): MapNode[] {
    let neighbours: MapNode[];
    this.routingService.getNodeNeighbours(nodeID).subscribe(node => {
      node.forEach(node => {
        if (nodeID == node.source) {
          // target node of node added as neighbour
          this.routingService.getNode(node.target).subscribe(node => {
            neighbours.push(node);
          });

        } else if (nodeID == node.target) {
          // source node of node added as neighbour
          this.routingService.getNode(node.source).subscribe(node => {
            neighbours.push(node);
          });
        }
      });
    });
    return neighbours;
  }
}
