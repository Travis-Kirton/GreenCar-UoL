import { Injectable } from "@angular/core";
import { AuthService } from './auth';
import { Http, Response } from "@angular/http";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs/Observable";

/**
 * Author: Travis Kirton
 * Desription: UserService @Service Component
 * Date: 03/05/2018
 */

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

  // Returns initial of User to be used as profile
  getInitial(): string {
    return this.authService.getUsername().charAt(0);
  }

  // Add user Type to DB
  addUserType(token, userType) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.put('https://greencar-uol.firebaseio.com/' + userId + '/roles.json?auth=' + token, userType)
      .map((response: Response) => {
        return response.json();
      });
  }

  // Saving Preferences to DB
  savePreferences(token, preferences) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.put('https://greencar-uol.firebaseio.com/' + userId + '/preferences.json?auth=' + token, preferences)
      .map((response: Response) => {
        return response.json();
      });
  }

  // Fetch Preferences from DB
  fetchPreferences(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://greencar-uol.firebaseio.com/' + userId + '/preferences.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      });
  }

  // Fetch Roles from FB
  fetchRoles(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://greencar-uol.firebaseio.com/' + userId + '/roles.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      });
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
