const ClassApdater = require("./classAdapter");


const mongoDriverObject = {

    connect: function(connString) {

        return {
            db: 'mongoDB.database',
            connString: connString
        }
    }
}

const mongoDBInterface = new AdapterInterface({
    connect: function() {

        const connString = 'mongoDB';

        this.connect(connString);
    }
})

const mysqlDriverObject = {

    connectToDB: function (connString) {

        return {
            db: 'mysql.database',
            connString: connString
        }
    }
}

const mySQLInterface = new AdapterInterface({
    connect: function() {

        const connString = 'mysql';

        this.connectToDB(connString);
    }
})

const adapterForMongoDB = new ClassApdater(mongoDriverObject, mongoDBInterface);
const adapterForMySQL = new ClassApdater(mongoDriverObject, mySQLInterface);

// AdapterInterface class is part of Service class to implement adapter design pattern

// you can also pass an Object (as the interface) to the second param of this class's constructor
// ClassAdpater with transform the Object to an AdapterInterface instance
const anotherAdapterForMongoDB = new ClassApdater(mongoDriverObject, {
    connect: function () {

        return 'Another way to create new ClassApdater';
    }
});