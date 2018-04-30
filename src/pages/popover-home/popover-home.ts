import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { UserService } from '../../services/user';

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
  userRole: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public userService: UserService) {
    this.user = this.navParams.get('user');
    
    this.userRole = this.userService.getUserRole();
  }

  messageUser(){
    this.navCtrl.push(ChatPage, {user: this.user});
  }

  removeUser(){

  }
}
