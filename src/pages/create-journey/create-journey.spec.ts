import { CreateJourneyPage } from './create-journey';
import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { NavController } from 'ionic-angular';
import {} from 'jasmine';

describe('Routing between 2 Roads', () => {
  let fixture: ComponentFixture<CreateJourneyPage>;
  let component: CreateJourneyPage;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateJourneyPage,
      ],
      providers: [
        CreateJourneyPage
      ],
    });
    fixture = TestBed.createComponent(CreateJourneyPage);
    component = fixture.componentInstance;
  });

  describe('Routing between 2 roads performance', () => {
    it('should return a time-taken value in ms', () => {
      component.showRouteDijkstra();
    })
  })
});
