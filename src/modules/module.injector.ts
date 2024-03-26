import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { CommunicationInjector } from './communication/communication.injector';
import { EhrInjector } from '../../src.bg.worker/src.bg/modules/ehr/ehr.injector';
import { FileStorageInjector } from './storage/file.storage.injector';

////////////////////////////////////////////////////////////////////////////////

export class ModuleInjector {

    static registerInjections(container: DependencyContainer) {

        EhrInjector.registerInjections(container);
        CommunicationInjector.registerInjections(container);
        FileStorageInjector.registerInjections(container);

    }

}
