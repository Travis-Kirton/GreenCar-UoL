import { Route } from './../../models/route';
import { AlertController, NavController, NavParams, Searchbar, Content } from 'ionic-angular';
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
import { Component, OnInit, ViewChild } from '@angular/core';
import { JourneyViewPage } from '../journey-view/journey-view';
import { JourneyMatchingService } from '../../services/journeyMatching';
import * as L from 'leaflet';
import { JourneyRetrievalService } from '../../services/journeyRetrieval';
import firebase from 'firebase';

/**
 * Author: Travis Kirton
 * Desription: CreateJourneyPage Component
 * Date: 03/05/2018
 */


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
  startSet: boolean = false;
  endSet: boolean = false;

  lat_lng: number[] = [];
  lat_lng_pairs: number[][] = [];
  dijkstraRoute: number[][] = [];

  private disableBtns: boolean = false;
  private currentDate: number = Date.now();
  private suggestedRoads: string[] = [];
  private showList: boolean = false;
  private searchbarName: string = "";

  @ViewChild(Content) content: Content;
  @ViewChild('searchbar') searchbar: Searchbar;

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
    private journeyMatchingService: JourneyMatchingService) {
  }

  // save created route
  saveRoute() {
    this.startSet = false;
    this.endSet = false;
    this.suggestedRoads = this.edgeStorageService.getRoadNames();

    // ensure start & end road names exist
    this.suggestedRoads.forEach(roadname => {
      if(this.startingPoint == roadname){
        this.startSet = true;
      }
      if(this.destination == roadname){
        this.endSet = true;
      }
    });

    // if destinations incorrect
    if (this.startingPoint == undefined || this.destination == undefined || this.startSet == false || this.endSet == false) {
      const alert = this.alertCtrl.create({
        title: 'Incorrect Details',
        message: 'Unknown Roads',
        buttons: ['Ok']
      });
      alert.present();
    }
    else if (this.startingPoint == "Point Not Found" || this.destination == "Point Not Found") {
      const alert = this.alertCtrl.create({
        title: 'Unknown Points',
        message: 'Please Pick 2 Known Roads',
        buttons: ['Ok']
      });
      alert.present();
    } else if (this.startingPoint.toLowerCase() == this.destination.toLowerCase()) {
      const alert = this.alertCtrl.create({
        title: 'Incorrect Destination',
        message: 'Start & End cannot be the same',
        buttons: ['Ok']
      });
      alert.present();
    } else {

      let loading = this.loadingCtrl.create({
        content: "Calculating route..."
      });
      loading.present().then(() => {
        // perform dijkstra using start & end points
        this.dijkstra.performDijkstras(this.startingPoint.toLowerCase(), this.destination.toLowerCase()).then(() => {
          loading.dismiss();
          this.dijkstraRoute = this.dijkstra.getPathAsCoords();
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

            console.log("completed");
            this.navCtrl.setRoot(JourneyViewPage, { start: this.startingPoint, destination: this.destination, route: this.dijkstraRoute, isSet: true });
          }
        });
        // this.astar.performAstar(this.startingPoint, this.destination).then(() => {
        //   console.log(JSON.stringify(this.astar.getPathAsCoords()));
        //   this.dijkstraRoute = this.astar.getPathAsCoords();
        //   this.mapService.drawRoute(this.dijkstraRoute);
        //   loading.dismiss();
        // });
      });
    }
  }

  // save coordinate data
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

  cancel() {
    this.navCtrl.pop();
  }

  ngOnInit() {
    // resize content to fix searchbar padding bug
    this.content.resize();

    // if user sets markers on non-roads, lock marker to real roads
    this.mapService.eventStart.forEach((event) => {
      let node = this.journeyMatchingService.findClosestNode(this.nodeStorageService.getNodes(), event._latlng.lat, event._latlng.lng);
      this.mapService.repositionStartMarker(node.lat, node.lon);
      this.startingPoint = this.edgeStorageService.getEdgeNameByNodeId(node);
    });
    this.mapService.eventEnd.forEach((event) => {
      let node = this.journeyMatchingService.findClosestNode(this.nodeStorageService.getNodes(), event._latlng.lat, event._latlng.lng);
      this.mapService.repositionDestinationMarker(node.lat, node.lon);
      this.destination = this.edgeStorageService.getEdgeNameByNodeId(node);
    });

    this.mapService.initialise();
    // if map already set previously
    if (this.navParams.get('isSet')) {
      this.dijkstraRoute = this.navParams.get('route');
      this.startingPoint = this.navParams.get('start')
      this.destination = this.navParams.get('end')
      this.disableBtns = true;
      this.mapService.drawRoute(this.dijkstraRoute);
    }
    this.edgeStorageService.populateRoadNames();
  }


  // on user typing into search bar, return list of filtered roads
  onSearchChange(searchValue: string): any {
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

  onSearchBar(searchbar) {
    this.searchbarName = searchbar;
  }

  // set each searchbar variable according to click
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
