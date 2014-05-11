var Stack, Queue, DLList;

if(typeof require !== undefined) {
    Stack = require('./stack');
    Queue = require('./queue');
    DLList = require('./dllist');
}
else {
    Stack = Stack || {};
    Queue = Queue || {};
    DLList = DLList || {};
}

function Link(node, cost) {
    this.cost = cost || 0;
    this.toNode = node || null;
}

function Node(name) {
    this.name = name || '';
    this.links = [];
    this.marked = false;
}

Node.prototype.addLink = function (obj) {
    if(obj.constructor.name === 'Link') {
        this.links.push(obj);
        return;
    }

    if(obj.constructor.name === 'Node') {
        this.links.push(new Link(obj));
        return;
    }

    throw new TypeError('obj should either be a Link or Node');
};

Node.prototype.hasLinkTo = function (obj) {
    var i, thisNode;
    for(i = 0; i < this.links.length; i += 1) {
        thisNode = this.links[i].toNode;

        if(thisNode === obj) {
            return true;
        }
    }

    return false;
};

Node.prototype.getLinkTo = function (obj) {
    var i, thisNode;

    for(i = 0; i < this.links.length; i += 1) {
        thisNode = this.links[i].toNode;

        if(thisNode === obj) {
            return this.links[i];
        }
    }

    return null;
};

function Graph(size) {
    this.size = size;
    this.nodes = [];
}

Graph.prototype.addNode = function (obj) {
    if(obj.constructor.name === 'Node') {
        this.nodes.push(obj);
        return;
    }

    throw new TypeError('obj should be a Node');
};

Graph.prototype.indexOf = function (obj) {
    if(obj.constructor.name !== 'Node') {
        throw new TypeError('obj should be of type Node');
    }

    var i, len = this.nodes.length;
    for(i = 0; i < len; i += 1) {
        if(obj === this.nodes[i]) {
            return i;
        }
    }

    return -1;
};

Graph.prototype.clearMarks = function () {
    for(var i = 0; i <= this.size; i += 1) {
        this.nodes[i].marked = false;
    }
};

Graph.prototype.depthFirstTraversal = function (startNode, fn) {
    var stack = new Stack();

    startNode.marked = true;
    stack.push(startNode);

    while(!stack.isEmpty()) {
        var currNode = stack.pop();
        if(fn) {
            fn.call(this, currNode);
        }
        for(var i = 0; i < currNode.links.length; i += 1) {
            var nextNode = currNode.links[i].toNode;
            if(!nextNode.marked) {
                nextNode.marked = true;
                stack.push(nextNode);
            }
        }
    }
};

// label-setting shortest path algorithm
Graph.prototype.shortestPath = function (from, to) {
    var pseudoInfinity = Math.pow(2, 32), i, j;

    // reseting helper properties
    for(i = 0; i < this.nodes.length; i += 1) {
        this.nodes[i].fromNode = undefined;
        this.nodes[i].totalCost = 0;
    }

    from.totalCost = 0;
    from.fromNode = from; // just to make sure the source node is not picked by a link later
    
    var listCandidates = new DLList();
    for(i = 0; i < from.links.length; i += 1) { // add all the neighbors to the list initially
        from.links[i].toNode.totalCost = from.links[i].cost;
        listCandidates.append(from.links[i]);
    }

    while(!listCandidates.isEmpty()) {
        var chosenCandidate = listCandidates.get(0),
            nextCandidate = chosenCandidate.toNode.links.length > 0 ? chosenCandidate.toNode.links[0] : null,
            smallestCost = chosenCandidate.toNode.totalCost + (nextCandidate !== null ? nextCandidate.cost : 0);

        for(i = 0; i < listCandidates.length; i += 1) {
            var thisCandidate = listCandidates.get(i),
                thisCost;

            console.log('checking', thisCandidate.toNode.name);
            if(thisCandidate.links.length === 0) { // if thisCandidate has no links, then the cost is just itself
                thisCost = thisCandidate.toNode.totalCost;
                if(thisCost < smallestCost) {
                    chosenCandidate = thisCandidate;
                    nextCandidate = null;
                    smallestCost = thisCost;
                }
            }
            else {
                for(j = 0; j < thisCandidate.toNode.links.length; j += 1) { // go through all the links to find the link with the smallest total cost
                    var thisNextCandidate = thisCandidate.toNode.links[j];
                    if(thisNextCandidate.toNode.fromNode !== undefined) {
                        // this node has already been used
                        continue;
                    }

                    thisCost = thisCandidate.toNode.totalCost + thisNextCandidate.cost;
                    if(thisCost < smallestCost) {
                        chosenCandidate = thisCandidate;
                        nextCandidate = thisNextCandidate;
                        smallestCost = thisCost;
                    }
                }
            }
        }

        // if fromNode is undefined, then this link is coming from the source node.
        if(chosenCandidate.toNode.fromNode === undefined) {
            chosenCandidate.toNode.fromNode = from;
        }
        
        // remove the chosen candidate from the candidates list
        listCandidates.remove(chosenCandidate);
        
        if(nextCandidate !== null) {
            nextCandidate.toNode.fromNode = chosenCandidate.toNode;
            nextCandidate.toNode.totalCost = chosenCandidate.toNode.totalCost + nextCandidate.cost;
            if(!listCandidates.contains(nextCandidate)) {
                listCandidates.append(nextCandidate);
            }
        }
    }

    // now that we have used up all the nodes backtrace from to to from to find the path
    var path = [to.name], node;
    for(node = to.fromNode; node !== from; node = node.fromNode) {
        path.unshift(node.name);
    }
    path.unshift(node.name);

    return path;

};

// label-correcting shortest path algorithm
Graph.prototype.dijkstra = function (from, to) {
    var pseudoInfinity = Math.pow(2, 32), i;
    // set all distances to infinity
    for(i = 0; i < this.nodes.length; i += 1) {
        this.nodes[i].distance = pseudoInfinity;
    }

    var q = new Queue();
    q.enqueue(from);

    from.distance = 0;

    while(!q.isEmpty()) {
        var currNode = q.dequeue();
        
        for(i = 0; i < currNode.links.length; i += 1) {
            var nextLink = currNode.links[i];
            if((currNode.distance + nextLink.cost) < nextLink.toNode.distance) {
                nextLink.toNode.distance = currNode.distance + nextLink.cost;
                nextLink.toNode.fromNode = currNode;

                if(q.contains(nextLink.toNode)) {
                    q.requeue(nextLink.toNode);
                }
                else {
                    q.enqueue(nextLink.toNode);
                }
            }
        }
    }

    var path = [to.name];
    for(var node = to.fromNode; node !== from; node = node.fromNode) {
        path.unshift(node.name);
    }
    path.unshift(node.name);

    return path;
};

// Floyd-Warshall algorithm
Graph.prototype.shortestPathAllPairs = function (from, to) {
    var pseudoInfinity = Math.pow(2, 32);

    var _fn_preComputeDistance = function() {
        var i, j, k;
            
        this.distance = new Array(this.size);
        this.via = new Array(this.size);
        for(i = 0; i < this.size; i += 1) {
            this.distance[i] = new Array(this.size);
            this.via[i] = new Array(this.size);
        }

        // initialize the distance array
        for(i = 0; i < this.size; i += 1) {
            for(j = 0; j < this.size; j += 1) {
                // setting up initial distance values
                if(i === j) {
                    this.distance[i][j] = 0;
                }
                else if (this.nodes[i].hasLinkTo(this.nodes[j])) {
                    this.distance[i][j] = this.nodes[i].getLinkTo(this.nodes[j]).cost;
                    this.via[i][j] = j;
                } else {
                    this.distance[i][j] = pseudoInfinity;
                }

                // setting up initial via values
                if(this.distance[i][j] < pseudoInfinity) {
                    this.via[i][j] = j;
                }
                else {
                    this.via[i][j] = -1;
                }
            }
        }

        // the loop
        for(i = 0; i< this.size; i += 1) { // via_node
            for(j = 0; j < this.size; j += 1) { // from_node
                for(k = 0; k < this.size; k += 1) { // to_node
                    var dist = this.distance[j][i] + this.distance[i][k];
                    if(dist < this.distance[j][k]) {
                        this.distance[j][k] = dist;
                        this.via[j][k] = i;
                    }
                }
            }
        }
    };

    var _fn_findPath = function (from_node, to_node) {
        var inx_from = this.indexOf(from_node),
            inx_to = this.indexOf(to_node);

        if(this.distance[inx_from][inx_to] === pseudoInfinity) {
            return null; // no path between these two nodes
        }

        var inx_via = this.via[inx_from][inx_to];

        if(inx_via === inx_to) {
            return [from_node.name, to_node.name];
        }
        else {
            var firstHalf = _fn_findPath.call(this, this.nodes[inx_from], this.nodes[inx_via]);
            var secondHalf = _fn_findPath.call(this, this.nodes[inx_via], this.nodes[inx_to]);

            return firstHalf.concat(secondHalf.slice(1));
        }
    };

    _fn_preComputeDistance.call(this);

    return _fn_findPath.call(this, from, to);
};

Graph.prototype.topologicalSort = function() {
    var taskOrder = [];
    var ready = new DLList();
    var i;

    for(i = 0; i < this.nodes.length; i += 1) {
        this.nodes[i].preqLeft = this.nodes[i].links.length;
        
        if(this.nodes[i].preqLeft === 0) {
            ready.append(this.nodes[i]);
        }
    }

    while(!ready.isEmpty()) {
        var thisNode = ready.removeAt(0);

        taskOrder.push(thisNode.name);

        for(i = 0; i < this.nodes.length; i += 1) {
            if(this.nodes[i].preqLeft === 0) { // already sent to the taskOrder list
                continue;
            }

            if(this.nodes[i].hasLinkTo(thisNode)) {
                this.nodes[i].preqLeft -= 1;
                if(this.nodes[i].preqLeft === 0) { // preqLeft 0, so send to the ready list
                    ready.append(this.nodes[i]);
                }
            }
        }
    }

    return taskOrder;
};

if(typeof module !== undefined) {
    module.exports = {
        Link: Link,
        Node: Node,
        Graph: Graph
    };
}