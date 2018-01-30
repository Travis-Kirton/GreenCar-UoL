import { Roles } from './../models/roles';
import { Http, Response } from "@angular/http";
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthService {
  private userToken: string;
  private roles: Roles;

  constructor(private http: Http){

  }

  signup(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  signin(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  logout() {
    firebase.auth().signOut();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }

  getUserRoles(){
    return this.roles;
  }

  checkUserRoles(token: string){
    const userId = this.getActiveUser().uid;
    return this.http.get('https://greencar-uol.firebaseio.com/' + userId + '/roles.json?auth=' + token)
      .map((response: Response) => {
        return response.json();
      })
      .do((_roles: Roles) => {
        if (_roles) {
          this.roles = _roles;
        } else {
          this.roles = null;
        }
      });
  }
}
