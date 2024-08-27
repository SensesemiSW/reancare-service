import { SenseDeviceVitalsService } from "../../../modules/devices/providers/senseH/ayta.device.vitals.service";
import { IECGLeadSixRepo } from "../../../database/repository.interfaces/clinical/biometrics/ecg.lead.six.repo.interface";
import { inject, injectable } from "tsyringe";

//////////////////////////////////////////////////////////

@injectable()
export class ECGLeadSixService {

    constructor (
        @inject('IECGLeadSixRepo') private _ecgLeadSixRepo: IECGLeadSixRepo
    ){}

    fetchAndStoreECGLeadSixData = async () => {
        const senseDeviceVitalsService = new SenseDeviceVitalsService();
        const ecgSixLeadData = await senseDeviceVitalsService.searchEcgSixLead(`${process.env.SENSE_PATIENT_ID}`);
        if (ecgSixLeadData) {
            await this._ecgLeadSixRepo.storeECGLeadSixData(ecgSixLeadData);
        }
    };

}
