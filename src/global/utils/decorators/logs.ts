export function logs() {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        let method = descriptor.value; // save methods before decorate
        descriptor.value = function (...args: any[]) { 
            let date = new Date() ;
            console.log(`${target.constructor.name}:${propertyKey}(): was start at UTC-Time: ${date.toUTCString()} `);

            method.apply(this, args);
        }
        return descriptor;
    }
}
