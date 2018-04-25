import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';

/**
 * Generated class for the PopoverHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-popover-home',
  templateUrl: 'popover-home.html',
})
export class PopoverHomePage {

  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.navParams.get('user');
    console.log(this.user);
  }

  messageUser(){
    this.navCtrl.push(ChatPage, {user: this.user});
  }

  removeUser(){

  }
}
