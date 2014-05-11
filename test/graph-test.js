var chai = require('chai');
var expect = chai.expect;
var graphModule = require('../graph');
var Graph = graphModule.Graph;
var Node = graphModule.Node;
var Link = graphModule.Link;

describe('testing shortest path algorithms', function() {
    var graph, nodeA, nodeB, nodeC, nodeD;

    beforeEach(function () {
        graph = new Graph(4);

        nodeA = new Node('A');
        nodeB = new Node('B');
        nodeC = new Node('C');
        nodeD = new Node('D');

        nodeA.addLink(new Link(nodeB, 1));
        nodeA.addLink(new Link(nodeD, 200));
        nodeB.addLink(new Link(nodeD, 4));
        nodeB.addLink(new Link(nodeC, 1000));
        nodeD.addLink(new Link(nodeC, 1));

        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        graph.addNode(nodeD);


    });

    it('dijkstra algorithm should return the shortest path A -> B -> D -> C', function() {
        var path = graph.dijkstra(nodeA, nodeC);
        expect(path).be.eql(['A', 'B', 'D', 'C']);
    });

    it('shortest-path algorithm should return the shortest path A -> B -> D -> C', function() {
        var path = graph.shortestPath(nodeA, nodeC);
        expect(path).be.eql(['A', 'B', 'D', 'C']);
    });

    it('shortestPathAllPairs algorithm should return the shortest path A -> B -> D -> C', function() {
        var path = graph.shortestPathAllPairs(nodeA, nodeC);
        expect(path).be.eql(['A', 'B', 'D', 'C']);
    });
});

describe('testing topological sorting algorithm', function() {
    
    var tasks;

    beforeEach(function() {
        var nObtainPermit = new Node('Obtain Permit');
        var nPlumbing = new Node('Plumbing');
        var nTileBacksplash = new Node('Tile Backsplash');
        var nDemolition = new Node('Demolition');
        var nWiring = new Node('Wiring');
        var nDrywall = new Node('Drywall');
        var nBuyAppliances = new Node('Buy Appliances');
        var nInitialInspection = new Node('Initial Inspection');
        var nPaintCeiling = new Node('Paint Ceiling');
        var nInstallAppliances = new Node('Install Appliances');
        var nPaintWalls = new Node('Paint Walls');
        var nInstallFlooring = new Node('Install Flooring');
        var nInstallCabinets = new Node('Install Cabinets');
        var nInstallLights = new Node('Install Lights');
        var nFinalInspection = new Node('Final Inspection');
        var nInstallCountertop = new Node('Install Countertop');

        // links are prerequirements for jobs
        nPlumbing.addLink(new Link(nDemolition));
        nTileBacksplash.addLink(new Link(nDrywall));
        nDemolition.addLink(new Link(nObtainPermit));
        nWiring.addLink(new Link(nDemolition));
        nDrywall.addLink(new Link(nWiring));
        nDrywall.addLink(new Link(nInitialInspection));
        nInitialInspection.addLink(new Link(nWiring));
        nPaintWalls.addLink(new Link(nDrywall));
        nPaintCeiling.addLink(new Link(nDrywall));
        nInstallAppliances.addLink(new Link(nBuyAppliances));
        nInstallAppliances.addLink(new Link(nInstallFlooring));
        nInstallFlooring.addLink(new Link(nPaintWalls));
        nInstallFlooring.addLink(new Link(nDrywall));
        nInstallFlooring.addLink(new Link(nPaintCeiling));
        nInstallCabinets.addLink(new Link(nInstallFlooring));
        nInstallLights.addLink(new Link(nPaintCeiling));
        nFinalInspection.addLink(new Link(nInstallAppliances));
        nFinalInspection.addLink(new Link(nInstallCabinets));
        nFinalInspection.addLink(new Link(nInstallFlooring));
        nFinalInspection.addLink(new Link(nInstallLights));
        nFinalInspection.addLink(new Link(nInstallCountertop));
        nInstallCountertop.addLink(new Link(nInstallCabinets));

        var graph = new Graph(16);
        graph.addNode(nObtainPermit);
        graph.addNode(nPlumbing);
        graph.addNode(nTileBacksplash);
        graph.addNode(nDemolition);
        graph.addNode(nWiring);
        graph.addNode(nDrywall);
        graph.addNode(nBuyAppliances);
        graph.addNode(nInitialInspection);
        graph.addNode(nPaintWalls);
        graph.addNode(nPaintCeiling);
        graph.addNode(nInstallAppliances);
        graph.addNode(nInstallFlooring);
        graph.addNode(nInstallCabinets);
        graph.addNode(nInstallLights);
        graph.addNode(nFinalInspection);
        graph.addNode(nInstallCountertop);

        tasks = graph.topologicalSort();

    });

    it('topological sort algorithm should return 16 results', function() {
        expect(tasks.length).to.equal(16);
    });

    it('should list final inspection last', function () {
        expect(tasks[tasks.length - 1]).to.equal('Final Inspection');
    });

    it('"Demolition" should come after "Obtain Permit"', function () {
        expect(tasks.indexOf('Demolition')).to.be.above(tasks.indexOf('Obtain Permit'));
    });

    it('"Initial Inspection" should come after "Plumbing"', function () {
        expect(tasks.indexOf('Initial Inspection')).to.be.above(tasks.indexOf('Plumbing'));
    });

});