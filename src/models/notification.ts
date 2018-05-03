import { Route } from "./route";

/**
 * Author: Travis Kirton
 * Desription: Notification Model
 * Date: 03/05/2018
 */

export interface NotificationMessage {
    username: string;
    userID: string; 
    journeyDate: number; 
    request: string; 
    seen: boolean;
    journey: Route;
}