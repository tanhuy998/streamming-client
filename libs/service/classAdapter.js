
class ClassApdater {

    #map;

    #isSetedUp;

    #targetObject;

    #changable;

    constructor(_object, _mapping, _changable = true) {

        this.#map = _mapping;
        this.#targetObject = _object;
        this.#isSetedUp = false;
        this.#changable = _changable

        this.#Init();
    }

    #Init() {

        this.map(this.#map);
    }
    
    get interface() {

        return this.#map;
    }

    /**
     * Map the interface for the Adapter
     * if _interface argument is passed '{}' 
     * The interface will be the whole target object
     * 
     * @param {Object} _interface 
     * @returns boolean
     */
    map(_interface) {

        if (this.#isSetedUp && !this.#changable) return false;

        if (this.#map != undefined || this.map !== null) {

            return false;
        }

        const keys = Reflect.ownKeys(_interface);

        if (keys.length == 0) {

            this.#map = this.#targetObject;

            return true;
        }

        for (const key of keys) {
            
            if (typeof _interface[key] != 'function') continue;

            _interface[key].bind(this.#targetObject);
        }

        this.#isSetedUp = true;

        return true;
    }
}

module.exports = {ClassApdater}