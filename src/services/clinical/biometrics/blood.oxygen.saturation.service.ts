import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBloodOxygenSaturationRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface";
import { BloodOxygenSaturationDomainModel } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import { BloodOxygenSaturationDto } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';
import { BloodOxygenSaturationSearchFilters, BloodOxygenSaturationSearchResults } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types';
import { BloodOxygenSaturationStore } from "../../../modules/ehr/services/blood.oxygen.saturation.store";
import { ConfigurationManager } from "../../../config/configuration.manager";
import { Injector } from "../../../startup/injector";
import { SenseDeviceVitalsService } from "../../../modules/devices/providers/senseH/ayta.device.vitals.service";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";
import { Logger } from "../../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodOxygenSaturationService {

    _ehrBloodOxygenSaturationStore: BloodOxygenSaturationStore = null;

    constructor(
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationRepo: IBloodOxygenSaturationRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,

    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrBloodOxygenSaturationStore = Injector.Container.resolve(BloodOxygenSaturationStore);
        }
    }

    create = async (bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto> => {

        if (this._ehrBloodOxygenSaturationStore) {
            const ehrId = await this._ehrBloodOxygenSaturationStore.add(bloodOxygenSaturationDomainModel);
            bloodOxygenSaturationDomainModel.EhrId = ehrId;
        }

        var dto = await this._bloodOxygenSaturationRepo.create(bloodOxygenSaturationDomainModel);
        return dto;
    };

    getById = async (id: uuid): Promise<BloodOxygenSaturationDto> => {
        return await this._bloodOxygenSaturationRepo.getById(id);
    };

    search = async (filters: BloodOxygenSaturationSearchFilters): Promise<BloodOxygenSaturationSearchResults> => {
        return await this._bloodOxygenSaturationRepo.search(filters);
    };

    update = async (id: uuid, bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto> => {
        var dto = await this._bloodOxygenSaturationRepo.update(id, bloodOxygenSaturationDomainModel);
        if (this._ehrBloodOxygenSaturationStore) {
            await this._ehrBloodOxygenSaturationStore.update(dto.EhrId, dto);
        }
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bloodOxygenSaturationRepo.delete(id);
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        return await this._bloodOxygenSaturationRepo.getAllUserResponsesBetween(patientUserId, dateFrom, dateTo);
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date)
        : Promise<any[]> => {
        return await this._bloodOxygenSaturationRepo.getAllUserResponsesBefore(patientUserId, date);
    };

    fetchAndStoreSpO2Data = async () => {
        try {
            // Fetch all patient UserIds from the patient repository
            const patientUserIds = await this._patientRepo.getAllPatientUserIds();
    
            // Create an instance of SenseDeviceVitalsService
            const senseDeviceVitalsService = new SenseDeviceVitalsService();
    
            // Loop through each UserId and fetch SpO2 data
            for (const userId of patientUserIds) {
                const spo2Data = await senseDeviceVitalsService.searchSpo2(userId);
                if (spo2Data) {
                    await this._bloodOxygenSaturationRepo.StoreSpo2Data(spo2Data);
                }
            }
        } catch (error) {
            Logger.instance().log(`Error fetching and storing SpO2 data: ${error}`);
        }
    };

}
