import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';


@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage implements OnInit{
  username: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public menuCtrl: MenuController) {
  }

  ngOnInit(): void {
   this.username = this.navParams.get('username');
    
  }


  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
   }
}
