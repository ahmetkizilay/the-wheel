function Stack() {
    this.data = [];
    this.index = 0;
}

Stack.prototype.push = function (obj) {
    this.data[this.index++] = obj;
};

Stack.prototype.pop = function (obj) {
    if(this.index !== 0) {
        return this.data[--this.index];
    }
};

Stack.prototype.length = function () {
    return this.index;
};

Stack.prototype.empty = function () {
    this.index = 0;
};

Stack.prototype.isEmpty = function () {
    return this.index === 0;
};

if(typeof module !== undefined) {
    module.exports = Stack;
}