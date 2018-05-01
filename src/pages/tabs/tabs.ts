import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { AlertController, NavController } from 'ionic-angular';
import { NotificationsService } from '../../services/notifications';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationMessage } from '../../models/notification';
import { Observable } from 'rxjs/Observable';
import firebase from 'firebase';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab2Root = AboutPage;
  tab3Root = ContactPage;

  userRole: any;

  private notifSub: any;
  private tab1BadgeCount: number = 0;

  constructor(private authService: AuthService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private nav: NavController,
    private notificationService: NotificationsService,
    private afDatabase: AngularFireDatabase) {
    this.setUserType();
    this.getNotifications();
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

  getNotifications() {
    this.notifSub = this.notificationService
      .getNotifications().snapshotChanges().subscribe(data => {
        this.tab1BadgeCount = data.length;
      });
  }

  ngOnDestroy() {
    this.notifSub.unsubscribe();
  }
}
