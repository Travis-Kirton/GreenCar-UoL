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
  dijkstraRoute: number[][] = [];

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
  }

  showRouteDijkstra() {
    // e.g. 20812 -> 9657
    this.edgeStorageService.demoSearchingNode();
    this.dijkstra.performDijkstras(this.startingPoint, this.destination);
    this.dijkstraRoute = this.dijkstra.getPathAsCoords();
    console.log(JSON.stringify(this.dijkstraRoute));
  }

  saveLatLng(data) {
    this.lat_lng_pairs = [];
    data.forEach(element => {
      this.lat_lng.push(element.x1) // longitude
      this.lat_lng.push(element.y1); // latitude
      this.lat_lng_pairs.push(this.lat_lng);
      this.lat_lng = [];
      this.lat_lng.push(element.x2);
      this.lat_lng.push(element.y2);
      this.lat_lng_pairs.push(this.lat_lng);
      this.lat_lng = [];
    });
    console.log(JSON.stringify(this.lat_lng_pairs));
  }
}
