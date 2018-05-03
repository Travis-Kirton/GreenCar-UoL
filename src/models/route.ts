/**
 * Author: Travis Kirton
 * Desription: Route Model
 * Date: 03/05/2018
 */

export interface Route {
  uid: string,
  role: string,
  status: string;
  disabled: boolean;
  dateBooked: number;
  startDate: number;
  pickUpTime: string;
  start: string;
  end: string;
  coords: number[][];
  username: string;
  repeating: boolean;
  daysOfWeek: object;
  description: string;
  comments: string[];
  luggageWeight?: number;
  seatsAvailable?: number;
  users?: any[];
  matchedRoute?: Route;
  suggestedRoutes?: Route[];
}


