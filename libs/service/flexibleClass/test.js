const AdapterInteface = require('../adapterInterface/adapterInterface.js');
const {FlexibleClass} = require('./flexibleClass.js');

const _interface = new AdapterInteface({
    printHelloWorld: function() {

        console.log('Hello World!');
    }
});


const flexibleObject = new FlexibleClass(_interface);

// Have to call the launch() method after create new instance of FlexibleClass
// in order to call the undefined behaviors
flexibleObject.launch();

console.log(flexibleObject.printHelloWorld)

//------------------------------------------------------------------------------------------------

// Another way to create new FlexibleClass instance
const anotherFlexibleObject = new FlexibleClass({
    printHelloWorld: () => {

        console.log('Hello World');
    }
}).launch()

console.log(anotherFlexibleObject.printHelloWorld)

//--------------------------------------------------------------------------------------------------------


class DerivedFromFlexibleClass extends FlexibleClass {

    constructor() {

        const _interface = {

            randomMethod: () => {

                console.log(`call "randomMethod" of DerivedFromFlexibleClass class's interface`);
            }
        }

        super(_interface);
    }

    randomMethod() {

        console.log(`call "randomMethod" of DerivedFromFlexibleClass class's definition`);
    }

    /**
    *   When the class definition and the interface has the same function's name
    *   the class's definition function will have the higher priority than the interface's function
    */
}


const derivedObject = new DerivedFromFlexibleClass();
derivedObject.launch();

// guest the outpur
console.log('Test for the invoke priority of FlexibleClass method');
derivedObject.randomMethod();
// output: call "randomMethod" of DerivedFromFlexibleClass class's definition


derivedObject.interface.randomMethod();
// output: call "randomMethod" of DerivedFromFlexibleClass class's interface


//------------------------------------------------------------------------------------------

class AnotherClass extends FlexibleClass {

    constructor() {

        const _interface = {
            func: () => {

                console.log('AnotherClass\'s "func"')
            }
        }

        super(_interface);
    }
}

const lastObject = new AnotherClass().launch();

lastObject.func();