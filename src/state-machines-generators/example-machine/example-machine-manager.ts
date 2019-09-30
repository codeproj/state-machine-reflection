import { BaseStateFactory } from "./../../global/utils/creators/state-creator";
import { Subject, Observable } from "rxjs";
import { BaseManager } from "../../global/base-state-machine/base-manager";
import { BaseState } from "../../global/base-state-machine/base-state";
import * as States from "../example-machine/states/index";
import { ExampleMachineEnum } from "./types/example-machine.enum";

export class ExampleMachineManager extends BaseManager {
    internalNotifier: Subject<any> = new Subject<any>();
    externalNotifier: Subject<any> = new Subject<any>();

    private constructor() {
        super();
    }

    static getInstance(): Observable<any> {
            
                let exampleMachineManager = new ExampleMachineManager();
                exampleMachineManager.initStates(exampleMachineManager);
                exampleMachineManager.internalNotifier
                .subscribe(
                    (res) => { 
                        exampleMachineManager.states[res].start() 
                    },
                    (error) => { exampleMachineManager.externalNotifier.error('error')  },
                    () => { exampleMachineManager.externalNotifier.complete() },
                );
                exampleMachineManager.states[ExampleMachineEnum.StartState].start();
                return exampleMachineManager.externalNotifier.asObservable();
    }

    getSubject(): Subject<any> {
        return this.internalNotifier;
    }

    initStates(coffeeStateManager: BaseManager): void {
        this.states =  BaseStateFactory.createStates(Object.keys(ExampleMachineEnum),coffeeStateManager, States);
    }
}