import { StatisticsPage } from './../pages/statistics/statistics';
import { SignupPage } from './../pages/signup/signup';
import { PreferencesPage } from './../pages/preferences/preferences';
import { SigninPage } from './../pages/signin/signin';
import { TabsPage } from './../pages/tabs/tabs';
import { AuthService } from './../services/auth';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, Events, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import firebase from 'firebase';
import { EdgeStorageService } from '../services/edgeStorage';
import { UserService } from '../services/user';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  signinPage = SigninPage;
  signupPage = SignupPage;
  preferencesPage = PreferencesPage;
  statisticsPage = StatisticsPage;
  isAuthenticated = false;

  userName: string;

  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private events: Events,
    private userService: UserService,
    private eSS: EdgeStorageService) {
    var config = {
      apiKey: "AIzaSyD3J_qrrKO3avQltX5mgtbA4ZY9QHbway4",
      authDomain: "greencar-uol.firebaseapp.com",
      databaseURL: "https://greencar-uol.firebaseio.com",
      projectId: "greencar-uol",
      storageBucket: "greencar-uol.appspot.com",
      messagingSenderId: "762723967654"
    };

    firebase.initializeApp(config);
    this.checkIfVerified();
    events.subscribe('user:name', (username) => {
      this.userName = username;
      this.authService.setUserName(this.userName);
    });

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onPushPage(page: any) {
    this.nav.push(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot(SigninPage);
  }

  checkIfVerified() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.events.publish('user:name', firebase.auth().currentUser.displayName);
        this.nav.setRoot(TabsPage);
      }
      else {
        this.nav.setRoot(SigninPage);
      }
    });
  }
}
