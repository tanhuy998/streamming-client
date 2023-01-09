const {FlexibleClass} = require('./flexibleClass.js');
const AdapterInteface = require('./adapterInterface.js');

const interface = new AdapterInteface({

    doHelloWorld: () => {

        console.log('Hello World!')
    }
})

const obj = new FlexibleClass(interface);

obj.doHelloWorld();

console.log(obj.doHelloWorld === interface.doHelloWorld)
