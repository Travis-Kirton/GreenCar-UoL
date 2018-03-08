import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController, Events } from "ionic-angular";
import firebase from 'firebase';
import { AuthService } from "../../services/auth";
import { UserService } from "../../services/user";
import { Http, Response } from "@angular/http";

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
        loading.dismiss();
        firebase.auth().currentUser.updateProfile({
          displayName: form.value.fullName,
          photoURL: "noPhoto"
        })
        .then(() => {
          this.events.publish('user:name', firebase.auth().currentUser.displayName);
          this.updateUserType();
          this.userService.addUserType(this.userType);
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
    console.log(this.type);
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
    console.log(this.userType);
  }
}
