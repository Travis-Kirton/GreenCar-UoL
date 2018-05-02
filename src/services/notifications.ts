import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Http, Response } from "@angular/http";
import { LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { NotificationMessage } from '../models/notification';


@Injectable()
export class NotificationsService {

    constructor(private authService: AuthService, 
        private afDatabase: AngularFireDatabase, 
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private http: Http) { }

    notifications: any[] = [];
    uid = this.authService.getActiveUser().uid; 
    notificationRef: AngularFireList<any> = this.afDatabase.list<NotificationMessage>(this.uid + '/notifications');

    pushNotificationToUser(userID, datestamp, request, uid, journey?) {
        let notificationRef = this.afDatabase.list<NotificationMessage>(uid + '/notifications');
        let notification: NotificationMessage = { seen: false,username: this.authService.getUsername(), userID: userID, journeyDate: datestamp, request: request, journey: journey };
        console.log("pushing to DB");
        return notificationRef.push(notification);
    }

    getNotifications() {
        return this.notificationRef;
    }

    removeNotification(key) {
        this.notificationRef.remove(key);
    }
}