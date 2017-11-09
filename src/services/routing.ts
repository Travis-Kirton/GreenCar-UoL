import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RoutingService {

  constructor(private http: Http) {
  }

  getRoute(startingPoint: string) {
    return this.http.get(`http://localhost:4000/route?destination='${startingPoint}'`)
    .map((res:Response) => res.json());
  }

}
