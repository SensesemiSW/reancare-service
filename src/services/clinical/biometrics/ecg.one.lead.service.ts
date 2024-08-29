import { SenseDeviceVitalsService } from "../../../modules/devices/providers/senseH/ayta.device.vitals.service";
import { IECGLeadOneRepo } from "../../../database/repository.interfaces/clinical/biometrics/ecg.lead.one.repo.interface";
import { inject, injectable } from "tsyringe";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";

//////////////////////////////////////////////////////////

@injectable()
export class ECGLeadOneService {

    constructor (
        @inject('IECGLeadOneRepo') private _ecgLeadOneRepo: IECGLeadOneRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,

    ){}

    fetchAndStoreECGLeadOneData = async () => {
        // Fetch all patient UserIds from the patient repository
        const patientUserIds = await this._patientRepo.getAllPatientUserIds();

        // Create an instance of SenseDeviceVitalsService
        const senseDeviceVitalsService = new SenseDeviceVitalsService();

        // Loop through each UserId and fetch ECG Lead One data
        for (const userId of patientUserIds) {
            const ecgOneLeadData = await senseDeviceVitalsService.searchEcgOneLead(userId);
            if (ecgOneLeadData) {
                await this._ecgLeadOneRepo.storeECGLeadOneData(ecgOneLeadData);
            }
        }
    };

}
