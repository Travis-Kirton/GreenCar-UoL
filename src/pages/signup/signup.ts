import { Component, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController, Events, MenuController } from "ionic-angular";
import  * as firebase  from 'firebase';
import { AuthService } from "../../services/auth";
import { UserService } from "../../services/user";
import { Http, Response } from "@angular/http";

import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  
  type: string = "";
  rider: boolean = false;
  driver: boolean = false;
  admin: boolean = false;

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
              private http: Http,) {
  }



  onSignup(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Signing you up...'
    });
    loading.present();
    this.authService.signup(form.value.email, form.value.password)
      .then(data => {
        firebase.auth().currentUser.updateProfile({
          displayName: form.value.fullName,
          photoURL: "noPhoto"
        })
        .then(() => {
          this.events.publish('user:name', firebase.auth().currentUser.displayName);
          this.updateUserType();
          this.authService.getActiveUser().getToken().then((token => {
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

  updateUserType(){
    switch(this.type){
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

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
   }
}
