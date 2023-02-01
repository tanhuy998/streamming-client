const {FlexibleClass} = require('./flexibleClass/flexibleClass.js');
const AdapterInteface = require('./adapterInterface/adapterInterface.js');

const interface = new AdapterInteface({

    doHelloWorld: () => {

        console.log('Hello World!')
    }
})

const obj = new FlexibleClass(interface);

obj.doHelloWorld();

console.log(obj.doHelloWorld === interface.doHelloWorld)

/////////////////////////////////////////////

const dbObj = {

    prop: 3,
    connectMongodb: function() {

        return 'MongoDB';
    },
    connectMysqll: function () {

        return 'MySQL';
    }
}

const adapter = new ClassApdater(dbObj, {
    connect: function() {

        return this.connectMongodb();
    },
    getProp: function() {

        return this.prop;
    }
})

const service = new Service(adapter).launch();

console.log(service.getProp());
