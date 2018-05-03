import { SignupPage } from './../signup/signup';
import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController, NavController, Events, MenuController } from "ionic-angular";

import { AuthService } from "../../services/auth";
import firebase  from 'firebase';
import { AboutPage } from '../about/about';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Author: Travis Kirton
 * Desription: SigninPage Component
 * Date: 03/05/2018
 */

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

  // Signin using form details
  onSignin(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Signing you in...'
    });
    loading.present();
    // call AuthService to signin using Firebase calls
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

  // Push Register Page
  onRegister() {
    this.navCtrl.push(SignupPage);
  }

  // On Page Load: Disable Side Menu swipe control
  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }
  
  // On Page Leave: Enable Side Menu swipe controll
  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }


  // Pass email to forgotten password call
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
        }
      },
      {
        text: 'Reset',
        handler: data => {
          // Using AngularFire to send password reset email (if details valid)
          this.afAuth.auth.sendPasswordResetEmail(data.email)
          .then(res => {
            const alert = this.alertCtrl.create({
              title: 'Email Sent!',
              message: 'an email has been sent to reset your password',
              buttons: ['Ok']
            });
            alert.present();
          })
          // If details invalid (e.g. no user associated with email)
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
