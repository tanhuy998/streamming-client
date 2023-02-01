const AdapterInterface = require("../adapterInterface/adapterInterface");

/**
 * An adapter give an interface for a proxy class(e.g: instances of Flexible, ....) interact with the target object 
 * beware of accessing and invoking any function of the interface because this class just provides the interface. 
 * Invoking any interface's functions would cause unexpecting result.
 * Use FlexibleClass instance for invoking interface's function to achieve the desired result.
 */
class ClassApdater {

    #interface;

    #isSetedUp;

    #targetObject;

    #changable;

    /**
     * 
     * @param {Object} _object 
     * @param {Object/AdapterInterface} _mapping 
     * @param {boolean} _changable 
     */
    constructor(_object, _mapping, _changable = false) {

        this.#interface = _mapping;
        this.#targetObject = _object;
        this.#isSetedUp = false;
        this.#changable = _changable

        this.#Init();
    }

    #Init() {

        this.map(this.#interface);
    }

    get target() {

        return this.#targetObject;
    }
    
    get interface() {

        return this.#interface;
    }

    /**
     * Map the interface for the Adapter
     * 
     * @param {Object} _interface 
     * @returns boolean
     */
    map(_interface) {

        if (this.#isSetedUp && !this.#changable) return false;

        const interface_type = _interface.constructor.name;

        if (interface_type == 'Object') {

            const keys = Reflect.ownKeys(_interface);

            if (keys.length == 0) throw new Error(`'{}' object is inacceptable for '_interface'`);

            this.#interface = new AdapterInterface(_interface);

            this.#isSetedUp = true;

            return true;
        }

        if (interface_type == 'AdapterInterface') {

            this.#interface = _interface;

            this.#isSetedUp = true;

            return true;
        }

        throw new  Error(`'_interface' must be type of Object or AdapterInterface`);
    }


    // not stable
    // not funciton
    #mapWholeObject(_object) {

        const object_type = _object.constructor.name;

        if (object_type == 'AdapterInterface') return _object;

        if (object_type == 'Object') return new AdapterInterface(_object);


        const props = Reflect.ownKeys(_object);

        for (const prop in props) {


        }

        return
    }

    /**
     * 
     * @param {Object} _interface 
     * 
     * @returns {Oject}
     */
    #bindInterface(_interface) {

        for (const prop in _interface) {

            if (prop.constructor.name == 'Function') prop.bind(this.#targetObject);
        }

        return _interface;
    }
}

module.exports = ClassApdater;