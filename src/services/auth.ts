import { Roles } from './../models/roles';
import { Http, Response } from "@angular/http";
import { Injectable } from '@angular/core';
import firebase  from 'firebase';

/**
 * Author: Travis Kirton
 * Desription: AuthService @Service Component
 * Date: 03/05/2018
 */

@Injectable()
export class AuthService {
  private userToken: string;
  private username: string;
  private roles: Roles;

  constructor(private http: Http){}

  // Sign Up using firebase Auth()
  signup(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  // Sign In using firebase Auth()
  signin(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  // Logout using firebase Auth()
  logout() {
    firebase.auth().signOut();
  }

  // Gets current user
  getActiveUser() {
    return firebase.auth().currentUser;
  }

  // Get current user Role object
  getUserRoles(){
    return this.roles;
  }

  // Set Username
  setUserName(username: string){
    this.username = username;
  }

  // Get UserName
  getUsername(){
    return this.username;
  }

  // Fetch User Roles and set roles variable
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
