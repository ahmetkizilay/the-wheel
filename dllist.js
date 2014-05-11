function DLCell(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
}

function DLList() {
    this.sentinel = new DLCell(null);
}

DLList.prototype.get = function(index) {
    if(index < 0) return null;
    var iterator = this.sentinel.next, i = 0;
    while(i < index && iterator !== null) {
        iterator = iterator.next;
        i += 1;
    }

    if(iterator !== null) {
        return iterator.value;
    }
    else {
        return null;
    }
};

DLList.prototype.append = function (obj) {
    var iterator = this.sentinel;

    while(iterator.next !== null) {
        iterator = iterator.next;
    }

    var cell;
    if(obj.constructor.name === 'DLCell') {
        cell = obj;
    } else {
        cell = new DLCell(obj);
    }

    iterator.next = cell;
    cell.prev = iterator;
};

DLList.prototype.contains = function (obj) {
    var iterator = this.sentinel.next;

    while(iterator !== null) {
        if(obj.constructor.name === 'DLCell') {
            if(iterator === obj) {
                return true;
            }
        } else {
            if(iterator.value === obj) {
                return true;
            }
        }

        iterator = iterator.next;
    }

    return false;
};

DLList.prototype.removeAt = function (index) {
    var obj = this.get(index);

    if(obj !== null) {
        this.remove(obj);
    }

    return obj;
};

DLList.prototype.remove = function (obj) {
    if(obj.constructor.name === 'DLCell') {
        obj.prev.next = obj.next;
        if(obj.next !== null) {
            obj.next.prev = obj.prev;
        }
    }
    else {
        var cell = this.sentinel.next;
        while(cell !== null) {
            if(cell.value === obj) {
                cell.prev.next = cell.next;

                if(cell.next !== null) {
                    cell.next.prev = cell.prev;
                }

                return;
            }

            cell = cell.next;
        }

        return null;
    }
};

DLList.prototype.toString = function() {
    var result = '', iterator = this.sentinel.next;
    while(iterator !== null) {
        result += (typeof(iterator.value.toString) === "function" ? iterator.value.toString() : iterator.value) + ' ';
        iterator = iterator.next;
    }

    return result;
};

DLList.prototype.isEmpty = function() {
    return this.sentinel.next === null;
};

DLList.prototype.length = function() {
    var i = 0, iterator = this.sentinel;

    while(iterator.next !== null) {
        i += 1;
        iterator = iterator.next;
    }

    return i;
};

if(typeof module !== undefined) {
    module.exports = DLList;
}