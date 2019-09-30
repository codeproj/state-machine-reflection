import { CoffeeMachineEnum } from "../types/coffee-machine.enum";
import { logs } from "../../../global/utils/decorators/logs";
import { BaseState } from "../../../global/base-state-machine/base-state";

export class AddCoffeeState extends BaseState {  
                @logs()
                start() {
                        setTimeout(()=>{
                                this.nextState(CoffeeMachineEnum.AddSugarState);
                            }, 5000);
                }
        }