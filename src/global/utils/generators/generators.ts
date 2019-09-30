import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import Project, { Scope } from 'ts-simple-ast';
import { IStateMachine } from '../../base-state-machine/state-machine.interface';

const filePath = path.resolve(__dirname, 'state-machines.json');
export const jsonData: IStateMachine[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

require('ts-node').register();

function fromCamelCase(text:string): string { 
    const firstCharToLowerCaseIfNeeded = text.charAt(0).toLowerCase() + text.slice(1)
    return firstCharToLowerCaseIfNeeded.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
}

function lowerCaseToFirstChar(text){
    return text.charAt(0).toLowerCase() + text.slice(1);
}

function createManager(project: Project, stateMachineItem:IStateMachine): void {
    const simpleClass = `export class ${stateMachineItem.name}Manager {}`;

    const dasherize = fromCamelCase(stateMachineItem.name);
    const lowerCaseOfFirstChar = lowerCaseToFirstChar(stateMachineItem.name);
    const pathToFile = `./src/state-machines-generators/${dasherize}/${dasherize}-manager.ts`;
    const myClassFile = project.createSourceFile(pathToFile, simpleClass, {overwrite: true});
    
    myClassFile.addImportDeclaration({
        defaultImport: '{ BaseStateFactory }',
        moduleSpecifier: './../../global/utils/creators/state-creator',
    });
    myClassFile.addImportDeclaration({
        defaultImport: '{ Subject, Observable }',
        moduleSpecifier: 'rxjs',
    });
    myClassFile.addImportDeclaration({
        defaultImport: '{ BaseManager }',
        moduleSpecifier: '../../global/base-state-machine/base-manager',
    });
    myClassFile.addImportDeclaration({
        defaultImport: '{ BaseState }',
        moduleSpecifier: '../../global/base-state-machine/base-state',
    });
    myClassFile.addImportDeclaration({
        defaultImport: '* as States',
        moduleSpecifier: `../${dasherize}/states/index`,
    });
    myClassFile.addImportDeclaration({
        defaultImport: `{ ${stateMachineItem.name}Enum }`,
        moduleSpecifier: `./types/${dasherize}.enum`,
    });
    myClassFile.saveSync();

    const myClass = myClassFile.getClassOrThrow(`${stateMachineItem.name}Manager`);
    myClass.setExtends('BaseManager');

    myClass.addProperty({
        name: 'internalNotifier',
        isStatic: false,
        type: 'Subject<any>',
        initializer: 'new Subject<any>()'
    });

    myClass.addProperty({
        name: 'externalNotifier',
        isStatic: false,
        type: 'Subject<any>',
        initializer: 'new Subject<any>()'
    });

    myClass.addConstructor({
        scope: Scope.Private,
        bodyText: 'super();',
    });

    myClass.addMethod({
        name: 'getInstance',
        isStatic: true,
        parameters: [],
        returnType: 'Observable<any>',
        bodyText: `    
        let ${lowerCaseOfFirstChar}Manager = new ${stateMachineItem.name}Manager();
        ${lowerCaseOfFirstChar}Manager.initStates(${lowerCaseOfFirstChar}Manager);
        ${lowerCaseOfFirstChar}Manager.internalNotifier
        .subscribe(
            (res) => { 
                ${lowerCaseOfFirstChar}Manager.states[res].start() 
            },
            (error) => { ${lowerCaseOfFirstChar}Manager.externalNotifier.error('error')  },
            () => { ${lowerCaseOfFirstChar}Manager.externalNotifier.complete() },
        );
        ${lowerCaseOfFirstChar}Manager.states[${stateMachineItem.name}Enum.StartState].start();
        return ${lowerCaseOfFirstChar}Manager.externalNotifier.asObservable();`,
    });

    myClass.addMethod({
        name: 'getSubject',
        isStatic: false,
        parameters: [],
        returnType: 'Subject<any>',
        bodyText: `return this.internalNotifier;`,
    });
    
    myClass.addMethod({
        name: 'initStates',
        isStatic: false,
        parameters: [{name: 'coffeeStateManager', type: 'BaseManager'}],
        returnType: 'void',
        bodyText: `this.states =  BaseStateFactory.createStates(Object.keys(${stateMachineItem.name}Enum),coffeeStateManager, States);`,
    });
}

function createStates(project: Project, stateMachineItem:IStateMachine): void {
    let allExports = ``;
    const dasherizeManager = fromCamelCase(stateMachineItem.name);

    stateMachineItem.states.forEach(stateItem => {
        const simpleClass = 
        `export class ${stateItem} extends BaseState {  
                @logs()
                start() {}
        }`;

        const dasherizeItem = fromCamelCase(stateItem);
        const pathToFile = `./src/state-machines-generators/${dasherizeManager}/states/${dasherizeItem}.ts`;
        const myClassFile = project.createSourceFile(pathToFile, simpleClass, {overwrite: true});
    
        allExports+= `\n export * from './${dasherizeItem}'`

        myClassFile.addImportDeclaration({
            defaultImport: `{ ${stateMachineItem.name}Enum }`,
            moduleSpecifier: `../types/${dasherizeManager}.enum`,
        });
        myClassFile.addImportDeclaration({
            defaultImport: '{ logs }',
            moduleSpecifier: '../../../global/utils/decorators/logs',
        });
        myClassFile.addImportDeclaration({
            defaultImport: '{ BaseState }',
            moduleSpecifier: '../../../global/base-state-machine/base-state',
        });

        myClassFile.saveSync();
    }); 
    const pathToFile = `./src/state-machines-generators/${dasherizeManager}/states/index.ts`;
    const simpleClass = allExports;
    const indexFile = project.createSourceFile(pathToFile, simpleClass, {overwrite: true});
 
    indexFile.saveSync();

}

function createEnum(project: Project, stateMachineItem:IStateMachine): void {
    const simpleEnum = `export enum ${stateMachineItem.name}Enum {}`;
    const dasherize = fromCamelCase(stateMachineItem.name);
    const pathToFile = `./src/state-machines-generators/${dasherize}/types/${dasherize}.enum.ts`;
    const myEnumFile = project.createSourceFile(pathToFile, simpleEnum, {overwrite: true});
    
    const enumDeclaration = myEnumFile.getEnum(`${stateMachineItem.name}Enum`); 
    stateMachineItem.states.forEach(stateItem => {
        enumDeclaration.addMember({
            name: `${stateItem}`,
            value: `${stateItem}`
    
        });
    })

    myEnumFile.save();   
    myEnumFile.saveSync();
}

function run() {
  const project = new Project();
  project.addExistingSourceFiles(`${__dirname}/state-machine/**/*.ts`);

  jsonData.forEach(stateMachineItem => {
    // Add Manager Class
    createManager(project, stateMachineItem);
    createEnum(project, stateMachineItem);
    createStates(project, stateMachineItem);

    project.saveSync();
  })
}

run();
