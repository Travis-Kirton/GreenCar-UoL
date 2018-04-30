import { Injectable } from "@angular/core";
import { AuthService } from './auth';
import { Http, Response } from "@angular/http";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserService {

  userColor: Observable<any>;
  private userRole: object;
  private preferences = {
    radius: 10,
    waitTime: 20,
    distance: "km"
  }

  constructor(private http: Http,
    private authService: AuthService,
    public afDatabase: AngularFireDatabase) { }

  getInitial(): string {
    return this.authService.getUsername().charAt(0);
  }

  addUserType(token, userType) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.put('https://greencar-uol.firebaseio.com/' + userId + '/roles.json?auth=' + token, userType)
      .map((response: Response) => {
        console.log("type saved");
        return response.json();
      });
  }

  savePreferences(token, preferences) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.put('https://greencar-uol.firebaseio.com/' + userId + '/preferences.json?auth=' + token, preferences)
      .map((response: Response) => {
        return response.json();
      });
  }

  fetchPreferences(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://greencar-uol.firebaseio.com/' + userId + '/preferences.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      });
  }

  fetchRoles(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://greencar-uol.firebaseio.com/' + userId + '/roles.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      });
  }

  reportUser(){
    
  }


  setUserRole(role) {
    this.userRole = role;
  }

  getUserRole(): any {
    return this.userRole;
  }

  setPreferences(preferences) {
    this.preferences = preferences;
  }

  getPreferences(): any {
    return this.preferences;
  }
}
