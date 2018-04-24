import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthService } from "./auth";
import { CommentMessage } from "../models/comment";
import { Observable } from "openlayers";

@Injectable()
export class CommentService {


    constructor(private afDatabase: AngularFireDatabase,
        public authService: AuthService) { }
    
    commentRef: any;
    username = this.authService.getActiveUser().displayName;
    commentMessages: any;
    commentMessage: CommentMessage;
    uid: string;


    addComment(routeKey: string, msg: string, uid: string) {
        this.commentRef = this.afDatabase.list<CommentMessage>(uid + '/routes/' + routeKey + '/comments');
        const timestamp = this.getTimeStamp();
        this.commentMessages = this.getComments(uid, routeKey);
        console.log(this.username);
        this.commentMessage = {
            message: msg,
            timeSent: timestamp,
            userName: this.username
        };
        return this.commentRef.push(this.commentMessage);
    }


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
