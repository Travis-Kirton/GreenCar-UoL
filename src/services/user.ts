import { Injectable } from "@angular/core";
import { AuthService} from './auth';
import { Http, Response } from "@angular/http";
import firebase from 'firebase';

@Injectable()
export class UserService{
  constructor(private http: Http,
              private authService: AuthService) {
  }

  addProfilePicture(){

  }

  editProfilePicture(){

  }

  addUserType(userType){
    let userId = firebase.auth().currentUser.uid;
    this.authService.getActiveUser().getToken().then((token => {
      this.http.put('https://greencar-uol.firebaseio.com/' + userId + '/roles.json?auth=' + token, userType)
      .map((response: Response) => {
        console.log(response.json());
        return response.json();
      });
    }));
  }

  savePreferences(token, preferences){
    const userId = this.authService.getActiveUser().uid;
    return this.http.put('https://greencar-uol.firebaseio.com/' + userId + '/preferences.json?auth=' + token, preferences)
    .map((response: Response) => {
      return response.json();
    });
  }

  fetchPreferences(token: string){
    const userId = this.authService.getActiveUser().uid;
    return this.http.get('https://greencar-uol.firebaseio.com/' + userId + '/preferences.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      });
  }

}
