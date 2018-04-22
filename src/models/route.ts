 export class Route{
    constructor(public status: string,
                public disabled: boolean,
                public  dateBooked: number,
                public  startDate: string,
                public  pickUpTime: string,
                public  start:string,
                public  end: string,
                public  coords: number[][],
                public  username: string,
                public  repeating: boolean,
                public  daysOfWeek = {
                  Mon: false,
                  Tue: false,
                  Wed: false,
                  Thu: false,
                  Fri: false,
                  Sat: false,
                  Sun: false
                },
                public  description: string,
                public  comments: string[],
                public  luggageWeight?: number,
                public  seatsAvailable?: number,
                public  users?: any[],
                public  matchedRoute?: Route,
                public  suggestedRoutes?: Route[]){}

}
