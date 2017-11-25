import { MapNode } from './../models/node';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RoutingService {

  constructor(private http: Http) {
  }

  getRoute(startingPoint: number) {
    return this.http.get(`http://localhost:4000/route?source='${startingPoint}'`)
    .map((res:Response) => res.json());
  }

  getNodeNeighbours(nodeID: number) {
    return this.http.get(`http://localhost:4000/neighbours?nodeID=${nodeID}`)
    .map((res: Response) => res.json());
  }

  getNode(nodeID: number){
    return this.http.get(`http://localhost:4000/node?nodeID=${nodeID}`)
    .map((res: Response) => res.json());
  }

}
