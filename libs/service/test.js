class A {

    constructor() {

        return new Proxy(this, {

            set: (object, key, value, proxy) => {

                object[key] = value;


                console.log('set');
                return true;
            }
        })
    }
}

const obj = new A();

console.log(obj instanceof A);
