import { Route } from './../../models/route';
import { AlertController, NavController, NavParams, Searchbar } from 'ionic-angular';
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
import { Component, OnInit,ViewChild } from '@angular/core';
import { JourneyViewPage } from '../journey-view/journey-view';
import { JourneyMatchingService } from '../../services/journeyMatching';
import * as L from 'leaflet';
import { JourneyRetrievalService } from '../../services/journeyRetrieval';
import firebase from 'firebase';


@Component({
  selector: 'page-create-journey',
  templateUrl: 'create-journey.html',
})
export class CreateJourneyPage implements OnInit {

  public zoom = 15;
  public opacity = 1.0;
  public width = 3;

  private startingPoint: string;
  private destination: string;

  lat_lng: number[] = [];
  lat_lng_pairs: number[][] = [];
  dijkstraRoute: number[][] = [];

  private disableBtns: boolean = false;
  private currentDate: number = Date.now();

  private suggestedRoads: string[] = [];
  private showList: boolean = false;

  private searchbarName: string = "";
  

  @ViewChild('searchbar') searchbar:Searchbar;

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

  saveRoute() {
    if(this.startingPoint == "Point Not Found" || this.destination == "Point Not Found"){
      const alert = this.alertCtrl.create({
        title: 'Unknown Points',
        message: 'Please Pick 2 Known Roads',
        buttons: ['Ok']
      });
      alert.present();
    }else if(this.startingPoint.toLowerCase() == this.destination.toLowerCase()){
      const alert = this.alertCtrl.create({
        title: 'Incorrect Destination',
        message: 'Start & End cannot be the same',
        buttons: ['Ok']
      });
      alert.present();
    }else{

    let loading = this.loadingCtrl.create({
      content: "Calculating route..."
    });
    loading.present().then(() => {
      this.dijkstra.performDijkstras(this.startingPoint.toLowerCase(), this.destination.toLowerCase()).then(() => {
        loading.dismiss();
        this.dijkstraRoute = this.dijkstra.getPathAsCoords();
        console.log(JSON.stringify(this.dijkstraRoute));

        // let journeys: any;
        // this.journeyRetrievalService.getJourneys()
        //   .then(data => {
        //     journeys = data;
        //     console.log(this.journeyMatchingService.findClosestStartMatch(this.dijkstraRoute[0][0], this.dijkstraRoute[0][1]));
        //   });
        this.mapService.drawRoute(this.dijkstraRoute);

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
    
          let start = this.startingPoint;
          let destination = this.destination;
          let route = this.dijkstraRoute;

          //this.journeyMatchingService.findClosestStartMatch(this.dijkstra[0][0], this.dijkstraRoute[0][1]);
          let lat = this.dijkstraRoute[0][0];
          let lon = this.dijkstraRoute[0][1];

          this.journeyMatchingService.findClosestStartMatch(lat, lon);

          this.navCtrl.setRoot(JourneyViewPage, { start: this.startingPoint, destination: this.destination, route: this.dijkstraRoute, isSet: true });
        }
      });
    });
  }
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

  cancel(){
    this.navCtrl.pop();
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
      this.dijkstraRoute = this.navParams.get('route');
      this.startingPoint = this.navParams.get('start')
      this.destination = this.navParams.get('end')
      this.disableBtns = true;
      this.mapService.drawRoute(this.dijkstraRoute);
    }
    this.edgeStorageService.populateRoadNames();
  }

  onSearchChange(searchValue: string) {
    this.suggestedRoads = this.edgeStorageService.getRoadNames();
    if (searchValue && searchValue.trim() != '') {
      this.suggestedRoads = this.suggestedRoads.filter((item) => {
        return (item.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1);
      });
      this.showList = true;
    } else {
      this.showList = false;
    }
  }

  onSearchBar(searchbar){
    this.searchbarName = searchbar;
  }

  roadNameClicked(roadname) {
    if (this.searchbarName == "start") {
      this.startingPoint = roadname;
      this.searchbar.setFocus();
      this.showList = false;

    } else if (this.searchbarName == "end") {
      this.destination = roadname;
      this.showList = false;

    }
  }
}
