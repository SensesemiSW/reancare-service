import { SenseDeviceVitalsService } from "../../../modules/devices/providers/senseH/ayta.device.vitals.service";
import { IECGLeadSixRepo } from "../../../database/repository.interfaces/clinical/biometrics/ecg.lead.six.repo.interface";
import { inject, injectable } from "tsyringe";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";

//////////////////////////////////////////////////////////

@injectable()
export class ECGLeadSixService {

    constructor (
        @inject('IECGLeadSixRepo') private _ecgLeadSixRepo: IECGLeadSixRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
    ){}

    fetchAndStoreECGLeadSixData = async () => {
        // Fetch all patient UserIds from the patient repository
        const patientUserIds = await this._patientRepo.getAllPatientUserIds();

        // Create an instance of SenseDeviceVitalsService
        const senseDeviceVitalsService = new SenseDeviceVitalsService();

        // Loop through each UserId and fetch ECG Lead Six data
        for (const userId of patientUserIds) {
            const ecgSixLeadData = await senseDeviceVitalsService.searchEcgSixLead(userId);
            if (ecgSixLeadData) {
                await this._ecgLeadSixRepo.storeECGLeadSixData(ecgSixLeadData);
            }
        }
    };

}
