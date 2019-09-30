import { BaseState } from '../../base-state-machine/base-state';
import { BaseManager } from '../../base-state-machine/base-manager';

export class BaseStateFactory {
	static createStates<T extends any>(typeContr: string[], baseManager: BaseManager, allStates:T, ... args: any[]): {} {
       const states: {} = {};
        typeContr.forEach(state => {
            const construtorFunction = (allStates as any)[state];
            if (!construtorFunction) throw new Error('No such BaseState');
            let stateCtor: BaseState = new construtorFunction(... args);
            stateCtor.stateMachineManager = baseManager;
            states[state] = stateCtor;
        })
        return states;
	}
}