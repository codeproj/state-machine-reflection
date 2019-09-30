import { ExampleMachineEnum } from "../types/example-machine.enum";
import { logs } from "../../../global/utils/decorators/logs";
import { BaseState } from "../../../global/base-state-machine/base-state";

export class CompleteState extends BaseState {  
                @logs()
                start() {}
        }