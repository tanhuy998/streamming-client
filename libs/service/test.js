const ClassApdater = require('./classAdapter/classAdapter.js');
const Service = require('./service.js');

const dbObj = {

    prop: 3,
    connectMongodb: function() {

        return 'MongoDB';
    },
    connectMysqll: function () {

        return 'MySQL';
    }
}

// The adapter for the dbObj
// we must use 'function' object for all the method for right context of 'this' keyword
const dbAdapter = new ClassApdater(dbObj, {
    connect: function() {

        return this.connectMongodb();
    },
    getProp: function() {

        return this.prop;
    }
})

class DatabaseService extends Service {

    constructor(adapter) {

        super(adapter);

        //return super.launch();
    }

    connect() {

        return 'DatabaseService connect method'
    }
}

const service = new DatabaseService(dbAdapter).launch();

console.log(service.connect());

console.log(service.interface.connect())

// reference to interface will cause error
// console.log(service.interface)