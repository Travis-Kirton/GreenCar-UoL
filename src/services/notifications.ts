import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Http, Response } from "@angular/http";
import { LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { NotificationMessage } from '../models/notification';

/**
 * Author: Travis Kirton
 * Desription: NotificationsService @Service Component
 * Date: 03/05/2018
 */

@Injectable()
export class NotificationsService {

    constructor(private authService: AuthService, 
        private afDatabase: AngularFireDatabase, 
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private http: Http) { }

    // Create UID of current user and database reference to notifications of current user
    notifications: any[] = [];
    uid = this.authService.getActiveUser().uid; 
    notificationRef: AngularFireList<any> = this.afDatabase.list<NotificationMessage>(this.uid + '/notifications');

    // Add new notification to Databse reference location
    pushNotificationToUser(userID, datestamp, request, uid, journey?) {
        let notificationRef = this.afDatabase.list<NotificationMessage>(uid + '/notifications');
        let notification: NotificationMessage = { seen: false,username: this.authService.getUsername(), userID: userID, journeyDate: datestamp, request: request, journey: journey };
        return notificationRef.push(notification);
    }

    // return all notifications
    getNotifications() {
        return this.notificationRef;
    }

    // remove single notification using key
    removeNotification(key) {
        this.notificationRef.remove(key);
    }
}