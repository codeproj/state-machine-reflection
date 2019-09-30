import { CoffeeMachineManager } from './state-machines-generators/coffee-machine/coffee-machine-manager';
require('ts-node').register();

class App {
    public static start() {
        CoffeeMachineManager.getInstance().subscribe((res)=>{
            console.log(`process raised`)
        },(error)=>{
            console.log(`process error`)
        },()=>{
            console.log(`process complete`)
        })
    }
}

App.start();
