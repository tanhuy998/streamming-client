
class AdapterInterface {

    interface;

    constructor(_map) {

        this.interface = _map;

        this.#Init();

        return new Proxy(this, {
            get: (target, prop, receiver) => {
        
                const target_interface = target.interface;
                //console.log('adapterInterface', prop);
                if (!target_interface[prop]) throw new Error(`Access undefined property of '${target.constructor.name}' type`, );
            
                return target.interface[prop];           
            },
            // apply: (method, methodArgs, _ArgurmentsList) => {

            //     return FlexibleHelper.resolveMethodCall(method, methodArgs, _ArgurmentsList);
            // },
            set: (target, prop, value) => {
                
                return false;
            },
        });
    }

    #Init() {  

        this.#checkInterface(this.interface);
    }

    #checkInterface(_object) {

        const type = _object.constructor.name;

        if (type != 'Object') throw new Error(`interface mapping must be type of 'Object'`);

        const keys = Reflect.ownKeys(_object);

        if (keys.length == 0) throw new Error(`The mappiing object could not be empty 'Object'`);
    }
}

module.exports = AdapterInterface;