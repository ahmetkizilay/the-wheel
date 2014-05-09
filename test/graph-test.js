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
});