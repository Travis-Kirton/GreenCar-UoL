#### BSc Comptuing Final Year Project
---
#### GreenCar@Uol - Progressive Web App
[![Build Status](https://travis-ci.org/Travis-Kirton/GreenCar-UoL.svg?branch=master)](https://travis-ci.org/Travis-Kirton/GreenCar-UoL)

##### Database

* PostGres Database
* PostGis Enabled
* OSM Data parsed in using OSM2PGROUTING
* Firebase for User Data Storage & Authentication
* Firebase storing data in JSON Format


##### Web Server

* NodeJS Web Server
* API calls to ```/route?starting=A?destination=B```
* Outputting routing from A to B in array of JSON lat_lng pairs


##### Front End
* Ionic 2 as user front-end, allowing PWA on mobile devices
* Making use of Angular2/TypeScript
* Map functionality provided by Openlayers3, using ngx-openlayers NPM library for easy Angular integration

---

### Sprints

#### Sprint 0 (14th October - 28th October)
* Created Firebase Infrastructure
* Implemented Sign-Up & Sign-In Views
* Wired Sign-In/Sign-Up views to Firebase for user authentication

#### Sprint 1 (30th October - 14th November)

* Moved onto technical challenges (Routing)
* Created PostGres Database with PostGIS (spatially enabled)
* Parsed OSM Data into PostGres using osm2pgrouting
* Created NodeJS Web API to allow simple queries of database
* Included Map functionality within Ionic 2 application using Openlayers 3
* Allow basic road queries within Front-end, showing road lines on map. Data being pulled from DB utilising NodeJs Web API

#### Sprint 2 (Nov 16th - November 30th)
* Research A-Star algorithm and how to apply to network
* Research technologies and other similar applications for Interim Report
* Sketch out Prototype System Design
* Find 2-4 roads within Leicester that are fairly close & pull data to perform routing on them. Don't focus on pre-processing data
* Allow for testing on routed roads. Test for correct latitude & longitudes
---




