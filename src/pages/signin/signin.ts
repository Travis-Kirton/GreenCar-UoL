import { SignupPage } from './../signup/signup';
import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController, NavController, Events, MenuController } from "ionic-angular";

import { AuthService } from "../../services/auth";
import  * as firebase  from 'firebase';
import { AboutPage } from '../about/about';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  constructor(public events: Events,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private afAuth: AngularFireAuth,
              private menuCtrl: MenuController) {
  }

  onSignin(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Signing you in...'
    });
    loading.present();
    this.authService.signin(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
        this.events.publish('user:name', firebase.auth().currentUser.displayName);
        this.navCtrl.push(AboutPage);
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Signin failed!',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }

  onRegister() {
    this.navCtrl.push(SignupPage);
  }

  
  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }
  
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }


  onForgottenPassword(){
   let alert = this.alertCtrl.create({
    title: 'Password Reset',
    inputs: [
      {
        name: 'email',
        placeholder: 'email'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Reset',
        handler: data => {
          console.log(data);
          this.afAuth.auth.sendPasswordResetEmail(data.email)
          .then(res => {
            const alert = this.alertCtrl.create({
              title: 'Email Sent!',
              message: 'an email has been sent to reset your password',
              buttons: ['Ok']
            });
            alert.present();
          })
          .catch(error => {
            const alert = this.alertCtrl.create({
              title: 'Signin failed!',
              message: error.message,
              buttons: ['Ok']
            });
            alert.present();
          })
        }
      }
    ]
  });
  alert.present();
  
  
  }
}
