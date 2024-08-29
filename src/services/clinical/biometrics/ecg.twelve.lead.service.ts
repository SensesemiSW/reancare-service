import { SenseDeviceVitalsService } from "../../../modules/devices/providers/senseH/ayta.device.vitals.service";
import { IECGLeadTwelveRepo } from "../../../database/repository.interfaces/clinical/biometrics/ecg.lead.twelve.repo.interface";
import { inject, injectable } from "tsyringe";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";

//////////////////////////////////////////////////////////

@injectable()
export class ECGLeadTwelveService {

    constructor (
        @inject('IECGLeadTwelveRepo') private _ecgLeadTwelveRepo: IECGLeadTwelveRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
    ){}

    fetchAndStoreECGLeadTwelveData = async () => {
        // Fetch all patient UserIds from the patient repository
        const patientUserIds = await this._patientRepo.getAllPatientUserIds();

        // Create an instance of SenseDeviceVitalsService
        const senseDeviceVitalsService = new SenseDeviceVitalsService();

        // Loop through each UserId and fetch ECG Lead Twelve data
        for (const userId of patientUserIds) {
            const ecgTwelveLeadData = await senseDeviceVitalsService.searchEcgTwelveLead(userId);
            if (ecgTwelveLeadData) {
                await this._ecgLeadTwelveRepo.storeECGLeadTwelveData(ecgTwelveLeadData);
            }
        }
    };

}
