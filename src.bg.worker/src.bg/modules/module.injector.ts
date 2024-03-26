import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { EhrInjector } from './ehr/ehr.injector';

////////////////////////////////////////////////////////////////////////////////

export class ModuleInjector {

    static registerInjections(container: DependencyContainer) {

        EhrInjector.registerInjections(container);

    }

}
