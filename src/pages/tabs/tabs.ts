import { MessagesPage } from './../messages/messages';
import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = MessagesPage;

  userRole: any;

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertCtrl: AlertController) {

    this.setUserType();

  }

  setUserType() {
    this.authService.getActiveUser().getIdToken()
      .then(
        (token: string) => {
          this.userService.fetchRoles(token)
            .subscribe(
              (roles) => {
                if (roles) {
                  this.userRole = roles;
                  this.userService.setUserRole(this.userRole);
                }
              },
              error => {
                this.handleError(error.json().error);
              }
            );
        });
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
