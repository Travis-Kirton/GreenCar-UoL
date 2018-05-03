import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthService } from "./auth";
import { CommentMessage } from "../models/comment";
import { Observable } from "openlayers";

/**
 * Author: Travis Kirton
 * Desription: CommentService @Service Component
 * Date: 03/05/2018
 */

@Injectable()
export class CommentService {


    constructor(private afDatabase: AngularFireDatabase,
                private authService: AuthService) { }
    
    commentRef: any;
    username = this.authService.getActiveUser().displayName;
    commentMessages: any;
    commentMessage: CommentMessage;
    uid: string;


    // Add Comment, passing in key of Journey, Message and User ID
    addComment(routeKey: string, msg: string, uid: string) {
        // Create Database reference using AngularFire2
        this.commentRef = this.afDatabase.list<CommentMessage>(uid + '/routes/' + routeKey + '/comments');
        const timestamp = this.getTimeStamp();
        this.commentMessages = this.getComments(uid, routeKey);
        this.commentMessage = {
            uid: this.authService.getActiveUser().uid,
            message: msg,
            timeSent: timestamp,
            userName: this.username
        };
        return this.commentRef.push(this.commentMessage);
    }


    // Create TimeStamp using current Date()
    getTimeStamp(): string {
        const now = new Date();
        const date = now.getUTCFullYear() + '/' +
            (now.getUTCMonth() + 1) + '/' +
            now.getUTCDate();
        const time = now.getUTCHours() + ':' +
            now.getUTCMinutes() + ':' +
            now.getUTCMinutes();
        return (date + ' ' + time);
    }

    getComments(uid: string, routeKey: string) {
        // query to create comment feed binding
        return this.commentRef = this.afDatabase.list<CommentMessage>(uid + '/routes/' + routeKey + '/comments');
    }
}
