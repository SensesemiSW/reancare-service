import 'reflect-metadata';
import { ModuleInjector } from '../modules/module.injector';
import { DependencyContainer, container } from 'tsyringe';

//////////////////////////////////////////////////////////////////////////////////////////////////

export class BGInjector {

    private static _container: DependencyContainer = container;

    public static get Container() {
        return BGInjector._container;
    }

    static registerInjections() {
        ModuleInjector.registerInjections(BGInjector.Container);
    }

}
