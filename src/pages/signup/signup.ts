import { Component, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController, Events, MenuController } from "ionic-angular";
import firebase from 'firebase';
import { AuthService } from "../../services/auth";
import { UserService } from "../../services/user";
import { Http, Response } from "@angular/http";
import { SigninPage } from '../signin/signin';

/**
 * Author: Travis Kirton
 * Desription: SignupPage Component
 * Date: 03/05/2018
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  type: string = "none";
  rider: boolean = false;
  driver: boolean = false;
  admin: boolean = false;

  // User Role Settings
  userType = {
    rider: this.rider,
    driver: this.driver,
    admin: this.admin
  }

  constructor(private authService: AuthService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    public events: Events,
    private http: Http, ) {
  }


  // Sign Up using form
  onSignup(form: NgForm) {
    if (this.type == "none") {
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Please Select a Role',
        buttons: ['Ok']
      });
      alert.present();
    } else {
      const loading = this.loadingCtrl.create({
        content: 'Signing you up...'
      });
      loading.present();
      // call AuthService to sign up using Firebase calls
      this.authService.signup(form.value.email, form.value.password)
        .then(data => {
          // set Display name
          firebase.auth().currentUser.updateProfile({
            displayName: form.value.fullName,
            photoURL: "noPhoto"
          })
            .then(() => {
              // publish display name as event to be used for sign in
              this.events.publish('user:name', firebase.auth().currentUser.displayName);
              this.updateUserType();
              this.authService.getActiveUser().getToken().then((token => {
                // add User Role to UserService
                this.userService.addUserType(token, this.userType)
                  .subscribe(
                    () => loading.dismiss()
                  );
              }));
            });
        })
        .catch(error => {
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Signup failed!',
            message: error.message,
            buttons: ['Ok']
          });
          alert.present();
        });
    }
  }

  // Update userType Object depending on form choice
  updateUserType() {
    switch (this.type) {
      case "driver": {
        this.userType.driver = true;
        break
      }
      case "rider": {
        this.userType.rider = true;
        break;
      }
      case "admin": {
        this.userType.admin = true;
        break;
      }
    }
  }

  // disable/enable swipe menu on enter & leave
  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }
}
