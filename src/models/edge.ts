import { MapNode } from './node';
export class Edge{
  constructor(public source: number,
              public target: number,
              public cost: number,
              public r_Cost: number){

  }
}
