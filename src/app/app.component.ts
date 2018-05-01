import { SignupPage } from './../pages/signup/signup';
import { PreferencesPage } from './../pages/preferences/preferences';
import { SigninPage } from './../pages/signin/signin';
import { TabsPage } from './../pages/tabs/tabs';
import { AuthService } from './../services/auth';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, Events, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from 'angularfire2/auth';
import { EdgeStorageService } from '../services/edgeStorage';
import { UserService } from '../services/user';
import { JourneyViewPage } from '../pages/journey-view/journey-view';
import { CommentService } from '../services/commentService';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  signinPage = SigninPage;
  signupPage = SignupPage;
  preferencesPage = PreferencesPage;
  isAuthenticated = false;

  userName: string;
  uid: string = ' ';
  initial: any;
  
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private events: Events,
    private afDatabase: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private eSS: EdgeStorageService,
    private user: UserService) {

    this.checkIfVerified();
    events.subscribe('user:name', (username) => {
      this.userName = username;
      this.uid = this.afAuth.auth.currentUser.uid;
      if(username != undefined){
        this.initial = this.userName.charAt(0);
      }
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
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        this.events.publish('user:name', this.afAuth.auth.currentUser.displayName);
        this.nav.setRoot(TabsPage);
      } else {
        this.nav.setRoot(SigninPage);
      }
    });

  }
}
