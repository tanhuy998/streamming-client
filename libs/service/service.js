const ClassApdater = require('./classAdapter/classAdapter.js');
const {FlexibleClass, FlexibleHelper} = require('./flexibleClass/flexibleClass.js');

/**
 *  a Proxy to interact with another class
 *  
 */
class Service extends FlexibleClass{

    adapter;
    #atemptUnplug;
    #isUnplug;
    //#__isInstantiate;

    /**
     *  This entire getter can't be reached
     *  but still here for use as fallback in the future
     */
    get interface() {
        //console.log('access getter')
        const adapter_target = this.adapter;

        const revocable = Proxy.revocable(super.interface, {

            get: (function(target, prop) {
                // target param is type of AdapterInterface

                //console.log('{serviceProxy}',target, prop)
                const is_function = target[prop].constructor.name == 'Function';
                
                //if (is_function) return target[prop].bind(this.adapter.target);
                if (is_function) return target[prop].bind(this);
                //console.log('serviceClass', target.constructor.name, target[prop])
                
                return target[prop];
            }).bind(adapter_target)
        })

        process.nextTick(function(_revocable) {
            revocable.revoke();
        },)

        return revocable.proxy;
    }

    constructor(_adapter, _interface = undefined, _isInstantiate = true) {
        
        let adapter;

        if (_adapter instanceof ClassApdater) {

            adapter = _adapter;
        }
        else {

            if (!_interface) throw new Error('invalid interface of constructor');

            adapter = new ClassApdater(_adapter, _interface);
        }

        super(adapter.interface, false);

        this.adapter = adapter;
        this.#atemptUnplug = undefined;
        this.#isUnplug = false;
        //this.#__isInstantiate = _isInstantiate;

        this.#Init();

        //if (_isInstantiate) return this.launch();
        // return new Proxy(this, )
    }

    get adapter() {

        return this.adapter;
    }

    /**
     * Override FlexibleClass lanch() method
     * This method add addition contraint for when retrieving unbehaviors of type "Function",
     * this class will bind that "Function" for the adapter's target Object
     * 
     * @returns {Proxy} 
     */
    launch() {
        
        // if (!this.#__isInstantiate) {

        //     return this;
        // }

        const adapter_target = this.adapter.target;

        return super.launch({
                //__targetObject: adapter_target,
                /**
                 * @parameter {AdapterInterface} target
                 * @parameter {string} prop
                 * 
                 * 
                 * @returns {any}
                 */
                get: (function(target, prop) {
                    // target param is type of AdapterInterface
                    //console.log('{serviceProxy}',target, prop)
                    const is_function = target[prop].constructor.name == 'Function';
                    
                    //if (is_function) return target[prop].bind(this.adapter.target);
                    if (is_function) return target[prop].bind(this);
                    //console.log('serviceClass', target.constructor.name, target[prop])
                    
                    return target[prop];
                }).bind(adapter_target)
            })
    }

    #Init() {

        this.#checkAdapter();
    }

    #checkAdapter() {

        const type = this.adapter.constructor.name;

        if (!(this.adapter instanceof ClassApdater)) throw new Error(`'_adapter' must be instance of ${ClassApdater.name}`);
    }

    plugin(_adapter) {
        this.#atemptUnplug = true;

        this.adapter = _adapter;

        this.#checkAdapter();

        this.#isUnplug = true;

        this.#plugout();
    }

    #plugout() {

        if (!this.#atemptUnplug && !this.#isUnplug) throw new Error('Could not change the Adapter');

        this.alterInterface(this.adapter.interface);

        this.#atemptUnplug = false;
        this.#isUnplug = false;
    }

}

module.exports = Service;