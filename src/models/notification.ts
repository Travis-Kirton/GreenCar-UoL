import { Route } from "./route";

export interface NotificationMessage {
    username: string;
    userID: string; 
    journeyDate: number; 
    request: string; 
    seen: boolean;
    journey: Route;
}