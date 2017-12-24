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

@Component({
  selector: 'page-create-journey',
  templateUrl: 'create-journey.html',
})
export class CreateJourneyPage implements OnInit{

  public zoom = 15;
  public opacity = 1.0;
  public width = 3;

  startingPoint: string;
  destination: string;

  lat_lng: number[] = [];
  lat_lng_pairs: number[][] = [];
  dijkstraRoute: number[][] = [];

  constructor(private loadingCtrl: LoadingController,
              private navParams: NavParams,
              private routingService: RoutingService,
              private mapService: MapService,
              private authService: AuthService,
              private nodeStorageService: NodeStorageService,
              private edgeStorageService: EdgeStorageService,
              private alertCtrl: AlertController,
              public navCtrl: NavController,
              private dijkstra: Dijkstra) {

                if (this.navParams.get('isSet')) {
                  let route = navParams.get('route');
                  console.log(route);
                   this.dijkstraRoute = route.coords;
                   console.log(this.dijkstraRoute);
                   this.startingPoint = route.start;
                   this.destination = route.end;
                }
  }
  showRouteDijkstra() {
    // e.g. 20812 -> 9657
    this.edgeStorageService.demoSearchingNode();
    let loading = this.loadingCtrl.create({
      content: "Calculating route..."
    });
    loading.present().then(() => {
      this.dijkstra.performDijkstras(this.startingPoint, this.destination).then(() => {
        loading.dismiss();
        this.dijkstraRoute = this.dijkstra.getPathAsCoords();
        console.log(JSON.stringify(this.dijkstraRoute));
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

    saveRoute(){
      if(this.dijkstraRoute == []){
        const alert = this.alertCtrl.create({
          title: 'Missing Route',
          message: 'Please Pick a Route',
          buttons: ['Ok']
        });
        alert.present();
      }else{
      this.routingService.addRoute(new Route(this.startingPoint, this.destination, this.dijkstraRoute));
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

          this.routingService.storeRoutes(this.authService.getActiveUserToken())
            .subscribe(
              () => loading.dismiss(),
              error => {
                loading.dismiss();
                this.handleError(error.json().error);
              }
            );
      this.navCtrl.popToRoot();
    }
    }

    ngOnInit() {
      this.mapService.initialise();
    }

    onLocateMe() {
      this.mapService.locateMe();
    }

    private handleError(errorMessage: string) {
      const alert = this.alertCtrl.create({
        title: 'An error occurred!',
        message: errorMessage,
        buttons: ['Ok']
      });
      alert.present();
    }
}
