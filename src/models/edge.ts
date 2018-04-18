import { MapNode } from './node';
export class Edge{
  constructor(public source: number,
              public target: number,
              public name: string,
              public cost: number,
              public cost_s: number,
              public r_Cost: number,
              public max_speed: number){

  }
}
