import { SenseDeviceVitalsService } from "../../../modules/devices/providers/senseH/ayta.device.vitals.service";
import { IECGLeadTwelveRepo } from "../../../database/repository.interfaces/clinical/biometrics/ecg.lead.twelve.repo.interface";
import { inject, injectable } from "tsyringe";

//////////////////////////////////////////////////////////

@injectable()
export class ECGLeadTwelveService {

    constructor (
        @inject('IECGLeadTwelveRepo') private _ecgLeadTwelveRepo: IECGLeadTwelveRepo
    ){}

    fetchAndStoreECGLeadTwelveData = async () => {
        const senseDeviceVitalsService = new SenseDeviceVitalsService();
        const ecgTwelveLeadData = await senseDeviceVitalsService.searchEcgTwelveLead(`${process.env.SENSE_PATIENT_ID}`);
        if (ecgTwelveLeadData) {
            await this._ecgLeadTwelveRepo.storeECGLeadTwelveData(ecgTwelveLeadData);
        }
    };

}
