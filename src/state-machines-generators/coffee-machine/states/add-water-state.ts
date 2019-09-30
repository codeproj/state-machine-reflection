import { CoffeeMachineEnum } from "../types/coffee-machine.enum";
import { logs } from "../../../global/utils/decorators/logs";
import { BaseState } from "../../../global/base-state-machine/base-state";

export class AddWaterState extends BaseState {  
                @logs()
                start() {
                        setTimeout(()=>{
                                this.nextState(CoffeeMachineEnum.CompleteState);
                            }, 1000);
                }
        }