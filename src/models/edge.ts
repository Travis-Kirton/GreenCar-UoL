import { MapNode } from './node';

/**
 * Author: Travis Kirton
 * Desription: Edge Model
 * Date: 03/05/2018
 */

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
