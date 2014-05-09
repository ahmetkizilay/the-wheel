function Queue(size) {
    this.maxLength = size || 100;
    this.length = 0;
    this.data = [];
    this.top = 0;
    this.next = 0;
}

Queue.prototype.enqueue = function (obj) {
    if(this.length === this.maxLength) {
        throw {'err': 'Queue is full'};
    }

    this.data[this.next] = obj;
    this.next = (this.next + 1) % this.maxLength;
    this.length += 1;
};

Queue.prototype.dequeue = function () {
    if(this.length === 0) {
        return null;
    }

    var result = this.data[this.top];
    this.top = (this.top + 1) % this.maxLength;
    this.length -= 1;

    return result;
};

Queue.prototype.isEmpty = function () {
    return this.length === 0;
};

Queue.prototype.empty = function () {
    this.length = 0;
    this.top = 0;
    this.next = 0;
};

Queue.prototype.contains = function(obj) {
    for(var i = 0; i < this.length; i += 1) {
        if(this.data[(i + this.top) % this.maxLength] === obj) {
            return true;
        }
    }

    return false;
};

Queue.prototype.requeue = function (obj) {
    var index = 0;
    
    while(index < this.length) {
        if(this.data[(index + this.top) % this.maxLength] !== obj) {
            index += 1;
        }
        else {
            index += 1;
            break;
        }
    }

    while(index < this.length) {
        this.data[(index + this.top - 1) % this.maxLength] = this.data[(index + this.top) % this.maxLength];
        index += 1;
    }

    this.data[(index + this.top - 1) % this.maxLength] = obj;
};

Queue.prototype.toString = function() {
    var output = '';

    for(var i = 0; i < this.length; i += 1) {
        var item = this.data[i + this.top];
        output += (typeof(item.toString) === "function" ? item.toString() : item) + ' ';
    }

    return output;
};

if(typeof module !== undefined) {
    module.exports = Queue;
}