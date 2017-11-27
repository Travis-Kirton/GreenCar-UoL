import { Dijkstra } from './../../services/dijkstra';
import { EdgeStorageService } from './../../services/edgeStorage';
import { NodeStorageService } from './../../services/nodeStorage';
import { MapNode } from './../../models/node';
import { Astar } from './../../services/astar';
import { Edge } from './../../models/edge';
import { RoutingService } from './../../services/routing';
import { Component } from '@angular/core';

@Component({
  selector: 'page-create-journey',
  templateUrl: 'create-journey.html',
})
export class CreateJourneyPage {

  public zoom = 15;
  public opacity = 1.0;
  public width = 3;

  startingPoint: number;
  destination: number;

  lat_lng: number[] = [];
  lat_lng_pairs: number[][] = [];

  edges: Edge[] = [];

  constructor(private routingService: RoutingService,
              private nodeStorageService: NodeStorageService,
              private edgeStorageService: EdgeStorageService,
              private dijkstra: Dijkstra) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateJourneyPage');
  }

  showRoute() {
    this.routingService.getRoute(this.startingPoint).subscribe(data => {
      this.saveLatLng(data);
    });

    // 20812 -> 17305
    this.edgeStorageService.demoSearchingNode();
    this.dijkstra.performDijkstras(this.startingPoint, this.destination);
  }

  saveLatLng(data) {
    this.lat_lng_pairs = [];
    data.forEach(element => {
      this.edges.push(new Edge(element.source, element.target, element.cost, element.reverse_cost));

      this.lat_lng.push(element.x1)
      this.lat_lng.push(element.y1);
      this.lat_lng_pairs.push(this.lat_lng);
      this.lat_lng = [];
      this.lat_lng.push(element.x2);
      this.lat_lng.push(element.y2);
      this.lat_lng_pairs.push(this.lat_lng);
      this.lat_lng = [];
    });
  }
}
