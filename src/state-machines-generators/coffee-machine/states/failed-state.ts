import { CoffeeMachineEnum } from "../types/coffee-machine.enum";
import { logs } from "../../../global/utils/decorators/logs";
import { BaseState } from "../../../global/base-state-machine/base-state";

export class FailedState extends BaseState {  
                @logs()
                start() {}
        }