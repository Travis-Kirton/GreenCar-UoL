import { AuthService } from './auth';
import { Route } from './../models/route';
import { reorderArray, ToastController } from 'ionic-angular';
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import 'rxjs/Rx';

@Injectable()
export class RoutingService {

  private routes: Route[] = [];

  constructor(private http: Http,
              private toastCtrl: ToastController,
              private authService: AuthService) {
  }

  addRoute(route: Route){
    this.routes.push(route);
  }

  disableRoute(index: number){
    this.routes[index].disabled = !this.routes[index].disabled;
    let toast = this.toastCtrl.create({
      message: 'Disabled Route, click again to enable',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  getRoutes(){
    return this.routes.slice();
  }

  removeRoute(index: number){
    this.routes.splice(index,1);
    this.authService.getActiveUser().getIdToken().then((token => {
      this.storeRoutes(token)
        .subscribe();
    }));
  }

  storeRoutes(token: string){
    const userId = this.authService.getActiveUser().uid;
    return this.http.put('https://greencar-uol.firebaseio.com/' + userId + '/routes.json?auth=' + token, this.routes)
    .map((response: Response) => {
      return response.json();
    });
  }

  fetchRoutes(token: string){
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://greencar-uol.firebaseio.com/' + userId + '/routes.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      })
      .do((routes: Route[]) => {
        if (routes) {
          this.routes = routes;
        } else {
          this.routes = [];
        }
      });
  }

}
