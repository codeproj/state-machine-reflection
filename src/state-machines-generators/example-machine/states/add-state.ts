import { ExampleMachineEnum } from "../types/example-machine.enum";
import { logs } from "../../../global/utils/decorators/logs";
import { BaseState } from "../../../global/base-state-machine/base-state";

export class AddState extends BaseState {  
                @logs()
                start() {}
        }