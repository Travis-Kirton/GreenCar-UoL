import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { CommentMessage } from '../../models/comment';
import { MessagingService } from '../../services/messaging';
import { AuthService } from '../../services/auth';

/**
 * Author: Travis Kirton
 * Desription: ChatPage Component
 * Date: 03/05/2018
 */

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  @ViewChild('content') content:any;

  uid =  this.authService.getActiveUser().uid;
  user: any = this.navParams.get('user');
  messageText: string
  private messageList$: Observable<CommentMessage[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService,
              public messageService: MessagingService) {
    
    // on page load, populate messages Observable
    this.messageList$ = this.messageService
              .getMessages(this.user.userID) // DB List
              .snapshotChanges() // Key:Value pairs
              .map(changes => {
                return changes.map(c => ({
                  key: c.payload.key,
                  ...c.payload.val()
                }));
              });
  }

  // send message via MessageService
  sendMessage(){
    this.messageService.sendMessage(this.messageText, this.user.userID).then(ref => {
    });
    this.messageText = ' ';
    this.content.scrollToBottom(300);
  }

  // on leaving page, unsubscribe to observable
  ngOnDestroy(){
    this.messageList$.subscribe().unsubscribe();
  }


}
