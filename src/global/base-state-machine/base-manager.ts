import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { BaseState } from './base-state';

export abstract class BaseManager {
    protected states: IStates;
    public abstract getSubject(): Subject<any>;
}

export interface IStates {
    [key: string]: BaseState;
}