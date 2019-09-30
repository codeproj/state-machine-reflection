export const StatesMap = {};

export function state(){
    return function (target) { // this is the decorator
        StatesMap[target.name] = Object.keys(StatesMap).length + 1;
        target.name = StatesMap[target.name];
    }
}
