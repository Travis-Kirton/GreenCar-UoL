import { User } from "./User";
import { JourneyDetails } from "./journeyDetails";

export class Journey {

    constructor(public uid: string,
                public driver: User[],
                public rider: User[],
                public journeyDetails: JourneyDetails[],
                public comments: {username: string, comment: string}[],
                public rating: number
            ){
    }
}