import { Route } from './../../models/route';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { AuthService } from './../../services/auth';
import { LoadingController } from 'ionic-angular';
import { Dijkstra } from './../../services/dijkstra';
import { EdgeStorageService } from './../../services/edgeStorage';
import { NodeStorageService } from './../../services/nodeStorage';
import { MapNode } from './../../models/node';
import { Astar } from './../../services/astar';
import { Edge } from './../../models/edge';
import { RoutingService } from './../../services/routing';
import { MapService } from './../../services/map';
import { Component, OnInit } from '@angular/core';
import { JourneyViewPage } from '../journey-view/journey-view';
import { JourneyMatchingService } from '../../services/journeyMatching';
import * as L from 'leaflet';
import { JourneyRetrievalService } from '../../services/journeyRetrieval';

@Component({
  selector: 'page-create-journey',
  templateUrl: 'create-journey.html',
})
export class CreateJourneyPage implements OnInit {

  public zoom = 15;
  public opacity = 1.0;
  public width = 3;

  startingPoint: string;
  destination: string;

  lat_lng: number[] = [];
  lat_lng_pairs: number[][] = [];
  dijkstraRoute: number[][] = [];

  private disableBtns: boolean = false;
  private currentDate: number = Date.now();


  constructor(private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private routingService: RoutingService,
    private mapService: MapService,
    private authService: AuthService,
    private nodeStorageService: NodeStorageService,
    private edgeStorageService: EdgeStorageService,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private dijkstra: Dijkstra,
    private astar: Astar,
    private journeyMatchingService: JourneyMatchingService,
    private journeyRetrievalService: JourneyRetrievalService) { }

  showRouteDijkstra() {
    // e.g. 20812 -> 9657
    //this.edgeStorageService.demoSearchingNode();
    // this.astar.performAstar(this.startingPoint, this.destination).then(() => {
    //   console.log(JSON.stringify(this.astar.getPathAsCoords()));
    //   this.dijkstraRoute = this.astar.getPathAsCoords();
    //   this.mapService.drawRoute(this.dijkstraRoute);
    // });
    let loading = this.loadingCtrl.create({
      content: "Calculating route..."
    });
    loading.present().then(() => {
      this.dijkstra.performDijkstras(this.startingPoint, this.destination).then(() => {
        loading.dismiss();
        this.dijkstraRoute = this.dijkstra.getPathAsCoords();
        //console.log(JSON.stringify(this.dijkstraRoute));
        
        let journeys: any;
        this.journeyRetrievalService.getJourneys()
          .then(data => {
            journeys = data;
            console.log(this.journeyMatchingService.findClosestStartMatch(journeys , this.dijkstraRoute[0][0], this.dijkstraRoute[0][1]));
          });
        this.mapService.drawRoute(this.dijkstraRoute);
      });
    });
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
  }

  saveRoute() {
    if (this.dijkstraRoute == []) {
      const alert = this.alertCtrl.create({
        title: 'Missing Route',
        message: 'Please Pick a Route',
        buttons: ['Ok']
      });
      alert.present();
    } else {
      const loading = this.loadingCtrl.create({
        content: 'Saving...'
      });
      let route = new Route(this.currentDate, false, this.startingPoint, this.destination, this.dijkstraRoute);
      this.navCtrl.push(JourneyViewPage, { route: route, isSet: true });
    }
  }

  ngOnInit() {
    // if user sets markers on non-roads 
    this.mapService.eventStart.forEach((event) => {
      this.startingPoint = event._latlng.lat + ", " + event._latlng.lng;
      let node = this.nodeStorageService.findClosestNode(this.nodeStorageService.getNodes(), event._latlng.lat, event._latlng.lng);
      this.mapService.repositionStartMarker(node.lat, node.lon);
      this.startingPoint = this.edgeStorageService.getEdgeNameByNodeId(node);
    });
    this.mapService.eventEnd.forEach((event) => {
      this.destination = event._latlng.lat + ", " + event._latlng.lng;
      let node = this.nodeStorageService.findClosestNode(this.nodeStorageService.getNodes(), event._latlng.lat, event._latlng.lng);
      this.mapService.repositionDestinationMarker(node.lat, node.lon);
      this.destination = this.edgeStorageService.getEdgeNameByNodeId(node);
    });

    this.mapService.initialise();
    if (this.navParams.get('isSet')) {
      let route = this.navParams.get('route');
      this.dijkstraRoute = route.coords;
      this.startingPoint = route.start;
      this.destination = route.end;
      this.disableBtns = true;
      this.mapService.drawRoute(this.dijkstraRoute);
    }

  }

  onLocateMe() {
    this.mapService.locateMe();
  }
}
