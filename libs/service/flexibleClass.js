//const objectClone = require('../objectCloning/objectClone.js');

/**
 * FlexibleClass is designed to be a wrapping proxy for specific class via an adapter
 * This class can invoke methods that is not defined in class's definition
 * by dealing with the adapter's inteface.
 * 
 * This class is implementing proxy and adapter design pattern
 * 
 */



class FlexibleHelper {
    /**
     * 
     * @param {Object} target 
     * @param {string} prop 
     * 
     * @returns {any}
     * 
     * @throws {Error}
     */
    static resolveGetter(target, prop) {

        if (!target[prop]) {
            
            if (!FlexibleHelper.canFlexible(target)) throw new Error(`Access undefined property of '${target.constructor.name}' type`);

            const target_interface = target.interface;

            if (!target_interface[prop]) throw new Error(`Access undefined property of '${target.constructor.name}' type`, );
    
            return target.interface[prop];
        }
    
        return target[prop];
    }
    
    /**
     * 
     * @param {Object} target 
     * @param {string} prop 
     * @param {any} value 
     * 
     * @throws {Error}
     */
    static resolveSetter(target, prop, value) {

        if (FlexibleHelper.canFlexible(target)) {

            FlexibleHelper.#preventOverideInterface(target, prop, 'set');
        }

        if (!target[prop]) throw new Error(`Could not asign value to undefined property of ${target.constructor.name}`);

        // prevent method overidden
        if (typeof target[prop] == 'Function') throw new Error(`Could ot overide the method of type '${target.constructor.name}' `);
        
        return true;
    }

    /**
     * 
     * @param {Function} method 
     * @param {array<any>} methodArgs 
     * @param {array<any>} _ArgurmentsList 
     * 
     * @return {any}
     */
    static resolveMethodCall(method , methodArgs, _ArgurmentsList) {

    
    }

    static #resolveInterface(target) {


    }

    static canFlexible(target) {

        return target.constructor.name == 'FlexibleClass';
    }

    /**
     * @param {Object} target
     * @param {string} prop
     * @param {string} _action
     * 
     * @throws {Error} 
     */
    static #preventOverideInterface(target, prop, _action) {

        const isInterface = (prop == 'interface');

        if (_action == 'set') {

            if (isInterface) throw new Error(`Could not overide 'interface' of ${target.constructor.name} derived from FlexibleClass`);

            const target_interface = target.interface;

            console.log(prop)

            if (target_interface[prop]) throw new Error(`Could not overide interface's property of ${target.constructor.name} derived from FlexibleClass`);
        }
    }
}

class FlexibleClass {
    /** 
     * The interface that this class deals with to perform undefined behaviors
     * 
     * Have to set access modifier to 'public' because this class delegates a Proxy to behavior interception.
     * 
     * @property {Object} 
     */
    interface;
    //#internalInterface;

    constructor(_interface) {

        this.interface = _interface;

        this.interface = new Proxy(_interface, {

            set: (target, prop, value) => {

                return FlexibleHelper.resolveSetter(target, prop, value);
            }
        })

        return new Proxy(this, {
            get: (target, prop, receiver) => {

                return FlexibleHelper.resolveGetter(target, prop);                
            },
            // apply: (method, methodArgs, _ArgurmentsList) => {

            //     return FlexibleHelper.resolveMethodCall(method, methodArgs, _ArgurmentsList);
            // },
            set: (target, prop, value) => {

                return FlexibleHelper.resolveSetter(target, prop, value);
            }
        })
    }

    alterInterface(_newInterface) {

        this.interface = _newInterface;
    }
}


module.exports = {FlexibleClass, FlexibleHelper};



