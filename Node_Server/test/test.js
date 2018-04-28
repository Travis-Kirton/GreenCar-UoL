var should = require("should");
var request = require("request");
var expect = require("chai").expect;
var baseUrl = "http://localhost:4000";
var util = require("util");


/**
 * Testing RESTful API
 * Location: localhost:4000
 * 
 * Tested By: Travis Kirton
 * Test Date: 28/04/2018
 * 
 * All Passing: Yes
 */


// Testing /allNode
describe("calls all nodes", function(){
    it("calls all nodes", function(done){
        request.get({url: baseUrl + '/allNode'},
        function(error, response, body){
            expect(response.statusCode).to.equal(200);
            console.log("Called All Nodes Successfully")
            done();
        });
    });
});

// Testing /allEdge
describe("calls all edges", function(){
    it("calls all edges", function(done){
        request.get({url: baseUrl + '/allEdge'},
        function(error, response, body){
            expect(response.statusCode).to.equal(200);
            console.log("Called All Edges Successfully")
            done();
        });
    });
});

// Testing /node (not used in application)
describe("Returns Node", function(){
    it("Returns Node", function(done){
        request.get({url: baseUrl + '/node?nodeID=1'},
        function(error, response, body){
            var bodyObj = JSON.parse(body);
            expect((bodyObj[0]).id).to.equal("1")
            expect((bodyObj[0]).osm_id).to.equal("4047473953")
            expect(response.statusCode).to.equal(200);
            console.log(body)
            done();
        });
    });
});

// Testing /neighbours (not used in application)
describe("Returns Neighbours", function(){
    it("Returns Neighbours", function(done){
        request.get({url: baseUrl + '/neighbours?nodeID=21483'},
        function(error, response, body){
            var bodyObj = JSON.parse(body);
            expect((bodyObj[0]).gid).to.equal("11807")
            expect((bodyObj[0]).osm_id).to.equal("4404876")
            expect(response.statusCode).to.equal(200);
            console.log(body)
            done();
        });
    });
});

// Testing /route (not used in application)
describe("Returns route", function(){
    it("Returns route", function(done){
        request.get({url: baseUrl + '/route?source=21483'},
        function(error, response, body){
            var bodyObj = JSON.parse(body);
            expect((bodyObj[0]).gid).to.equal("16555")
            expect((bodyObj[0]).osm_id).to.equal("4404876")
            expect(response.statusCode).to.equal(200);
            console.log(body)
            done();
        });
    });
});






