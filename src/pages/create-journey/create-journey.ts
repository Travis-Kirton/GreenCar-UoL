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

  startingPoint: string;
  destination: string;

  lat_lng: number[] = [];
  lat_lng_pairs: number[][] = [];

  constructor(private routingService: RoutingService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateJourneyPage');
  }

  showRoute() {
    this.routingService.getRoute(this.startingPoint).subscribe(data => {
      this.saveLatLng(data);
    });
  }

  saveLatLng(data) {
    this.lat_lng_pairs = [];
    data.forEach(element => {
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
