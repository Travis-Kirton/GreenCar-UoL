import { Injectable } from "@angular/core";
import { AuthService } from './auth';
import { Http, Response } from "@angular/http";

@Injectable()
export class UserService {

  private userRole: any;

  constructor(private http: Http,
    private authService: AuthService) {
  }

  addProfilePicture() {

  }

  editProfilePicture() {

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

  setUserRole(role){
    this.userRole = role;
  }

  getUserRole(): object{
    return this.userRole;
  }

  fetchRoles(token: string){
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://greencar-uol.firebaseio.com/' + userId + '/roles.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      });
  }
}
