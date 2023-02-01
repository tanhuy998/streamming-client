//const objectClone = require('../objectCloning/objectClone.js');
const AdapterInterface  = require('../adapterInterface/adapterInterface.js');

/**
 * FlexibleClass is designed to do undefined behaviors 
 * This class can invoke methods that is not defined in class's definition
 * by dealing with an AdapterInterface instance.
 * 
 */
class FlexibleHelper {

    static #prototype = Symbol('FlexiblePrototype');

    static get PROTOTYPE() {

        return FlexibleHelper.#prototype;
    }

    /**
     * 
     * @param {Object} target 
     * @param {string} prop 
     * 
     * @returns {any}
     * 
     * @throws {Error}
     */
    static resolveGetter(target, prop, _next) {

        if (!target[prop]) {
            
            if (!FlexibleHelper.canFlexible(target)) throw new Error(`Access undefined property of '${target.constructor.name}' type`);

            const target_interface = target.interface;
            
            //console.log('{flexibleClass}', target.constructor.name, prop)
            if (!target_interface[prop]) throw new Error(`Access undefined property of '${target.constructor.name}' type`, );
            
            //console.log('{1} interface has prop: ', prop)
            if (_next) return _next(target.interface, prop);

            //console.log('{without next}');
            return target.interface[prop];
        }

        //console.log('{hasProp}')
        // 
        if (_next) return _next(target, prop);
    
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
    static resolveSetter(target, prop, value, _next) {

        if (FlexibleHelper.canFlexible(target)) {

            FlexibleHelper.#preventOverideInterface(target, prop, 'set');
        }

        if (!target[prop]) throw new Error(`Could not asign value to undefined property of ${target.constructor.name}`);

        // prevent method overidden
        if (target[prop].constructor.name == 'Function') throw new Error(`Could ot overide the method of type '${target.constructor.name}' `);
        
        if (_next) return _next(target, prop, value);

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

        return target instanceof FlexibleClass;
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

            if (target_interface[prop]) throw new Error(`Could not overide interface's property of ${target.constructor.name} derived from FlexibleClass`);
        }
    }

    /**
     * 
     * @param {FlexibleClass} _flexibleObject 
     * @param {Object} _mergeOption 
     */
    static resolveFlexible(_object, _plugin) {

        if (!(_object instanceof FlexibleClass)) throw new Error('Resolve proxy failed');

        _plugin = (_plugin)? _plugin : {};

        return new Proxy(_object, {
            get: (target, prop, receiver) => {
                
                return FlexibleHelper.resolveGetter(target, prop, _plugin.get);     
            },
            // apply: (method, methodArgs, _ArgurmentsList) => {

            //     return FlexibleHelper.resolveMethodCall(method, methodArgs, _ArgurmentsList);
            // },
            set: (target, prop, value) => {

                // FlexibleHelper.resolveSetter just reject  of Flexible's interface
                return FlexibleHelper.resolveSetter(target, prop, value, _plugin.set);
            }
        })
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
    

    constructor(_interface) {
        this.interface = _interface;
        
        this.#Init();
    }

    #Init() {

        this.#checkValidInterface();

        // const current_type = this.constructor.name;

        // if (this instanceof FlexibleClass && current_type != FlexibleClass.name) {

        //     this.#hasDerivedClass = true;
        // }
    }

    #_resolveFlexibility(_constraint) {

        return FlexibleHelper.resolveFlexible(this, _constraint);
    }

    /**
     * Start doing undefined behaviors
     * Undefined behaviors is based on the interface that that class init
     * 
     * @param {Object} _constraint  
     * @returns 
     */
    launch(_constraint) {

        return this.#_resolveFlexibility(_constraint); 
    }


    #checkValidInterface() {

        if (this.interface instanceof AdapterInterface) return;

        this.interface = new AdapterInterface(this.interface);
        
        // if (this.interface.constructor.name != AdapterInterface.name) {

        //     throw new Error(`The Interface of Adapter must be type of 'AdapterInteface' or 'Object'`);
        // }
    }

    /**
     *  NOT STABLE
     * 
     * @param {*} _newInterface 
     */
    alterInterface(_newInterface) {

        this.interface = _newInterface;

        this.#checkValidInterface();
    }
}




module.exports = {FlexibleClass, FlexibleHelper};



