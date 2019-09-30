import { BaseManager } from "../base-state-machine/base-manager";

export abstract class BaseState {  
    
   stateMachineManager: BaseManager;

   nextState(index: string): void {
     this.stateMachineManager.getSubject().next(index);
   }
   
   error(message): void {
    this.stateMachineManager.getSubject().error({state: this, message});
   }

   complete(): void {
    this.stateMachineManager.getSubject().complete()
   }

   abstract start(); // run on every state starting
}