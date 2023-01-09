
class AdapterInterface {

    interface;

    constructor(_map) {

        this.interface = _map;

        return new Proxy(this, {
            get: (target, prop, receiver) => {
        
                const target_interface = target.interface;
        
                if (!target_interface[prop]) throw new Error(`Access undefined property of '${target.constructor.name}' type`, );
            
                return target.interface[prop];           
            },
            // apply: (method, methodArgs, _ArgurmentsList) => {

            //     return FlexibleHelper.resolveMethodCall(method, methodArgs, _ArgurmentsList);
            // },
            set: (target, prop, value) => {
                
                return true;
            },
        });
    }
}

module.exports = AdapterInterface;