import { SenseDeviceVitalsService } from "../../../modules/devices/providers/senseH/ayta.device.vitals.service";
import { IECGLeadOneRepo } from "../../../database/repository.interfaces/clinical/biometrics/ecg.lead.one.repo.interface";
import { inject, injectable } from "tsyringe";

//////////////////////////////////////////////////////////

@injectable()
export class ECGLeadOneService {

    constructor (
        @inject('IECGLeadOneRepo') private _ecgLeadOneRepo: IECGLeadOneRepo
    ){}

    fetchAndStoreECGLeadOneData = async () => {
        const senseDeviceVitalsService = new SenseDeviceVitalsService();
        const ecgOneLeadData = await senseDeviceVitalsService.searchEcgOneLead(`${process.env.SENSE_PATIENT_ID}`);
        if (ecgOneLeadData) {
            await this._ecgLeadOneRepo.storeECGLeadOneData(ecgOneLeadData);
        }
    };

}
