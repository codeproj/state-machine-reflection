import { BaseStateFactory } from "./../../global/utils/creators/state-creator";
import { Subject, Observable } from "rxjs";
import { BaseManager } from "../../global/base-state-machine/base-manager";
import { BaseState } from "../../global/base-state-machine/base-state";
import * as States from "../coffee-machine/states/index";
import { CoffeeMachineEnum } from "./types/coffee-machine.enum";

export class CoffeeMachineManager extends BaseManager {
    internalNotifier: Subject<any> = new Subject<any>();
    externalNotifier: Subject<any> = new Subject<any>();

    private constructor() {
        super();
    }

    static getInstance(): Observable<any> {
            
                let coffeeMachineManager = new CoffeeMachineManager();
                coffeeMachineManager.initStates(coffeeMachineManager);
                coffeeMachineManager.internalNotifier
                .subscribe(
                    (res) => { 
                        coffeeMachineManager.states[res].start() 
                    },
                    (error) => { coffeeMachineManager.externalNotifier.error('error')  },
                    () => { coffeeMachineManager.externalNotifier.complete() },
                );
                coffeeMachineManager.states[CoffeeMachineEnum.StartState].start();
                return coffeeMachineManager.externalNotifier.asObservable();
    }

    getSubject(): Subject<any> {
        return this.internalNotifier;
    }

    initStates(coffeeStateManager: BaseManager): void {
        this.states =  BaseStateFactory.createStates(Object.keys(CoffeeMachineEnum),coffeeStateManager, States);
    }
}