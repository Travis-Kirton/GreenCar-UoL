import { StatisticsPage } from './../pages/statistics/statistics';
import { SignupPage } from './../pages/signup/signup';
import { PreferencesPage } from './../pages/preferences/preferences';
import { SigninPage } from './../pages/signin/signin';
import { TabsPage } from './../pages/tabs/tabs';
import { AuthService } from './../services/auth';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  tabsPage: any = TabsPage;
  signinPage = SigninPage;
  signupPage = SignupPage;
  preferencesPage = PreferencesPage;
  statisticsPage = StatisticsPage;
  rootPage: any;
  isAuthenticated = false;

  userName: string;

  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    private authService: AuthService,
    public events: Events,
    signupPage: SignupPage) {
    var config = {
      apiKey: "AIzaSyD3J_qrrKO3avQltX5mgtbA4ZY9QHbway4",
      authDomain: "greencar-uol.firebaseapp.com",
      databaseURL: "https://greencar-uol.firebaseio.com",
      projectId: "greencar-uol",
      storageBucket: "greencar-uol.appspot.com",
      messagingSenderId: "762723967654"
    };
    firebase.initializeApp(config);

    this.checkUserState();
    let fireBaseUser = firebase.auth().currentUser;
    this.rootPage = fireBaseUser ? TabsPage : SigninPage;
    events.subscribe('user:name', (username) => {
      this.userName = username;
    })

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
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

  checkUserState() {
    let userToken: string = "";
    let userUID: string = "";
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(function(data) {
          userToken = data;
          userUID = user.uid;
        });
        this.events.publish('user:name', firebase.auth().currentUser.displayName);
        this.nav.setRoot(TabsPage);
        this.authService.setActiveUserToken(userToken);
        this.authService.setUID(userUID);
      }
      else {
        this.nav.setRoot(SigninPage);
      }
    });
  }
}
