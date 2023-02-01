const AdapterInterface = require('./adapterInterface.js');

const mongoDriver = {

    connect: function(connString) {

        return {
            db: 'mongoDB.database',
            connString: connString
        }
    }
}

const mysqlDriver = {

    connectToDB: function (connString) {

        return {
            db: 'mysql.database',
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

const mySQLInterface = new AdapterInterface({
    connect: function() {

        const connString = 'mysql';

        this.connectToDB(connString);
    }
})

