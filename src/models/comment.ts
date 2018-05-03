/**
 * Author: Travis Kirton
 * Desription: Comment Model
 * Date: 03/05/2018
 */

export interface CommentMessage {
    key?: string;
    uid: string;
    userName: string;
    message: string;
    timeSent: string;
}