import { SenseDeviceVitalsUsageService } from "../../../modules/devices/providers/senseH/ayta.device.vitals.usage.service";
import { ISenseDeviceAdminRepo } from "../../../database/repository.interfaces/users/user/user.sense.admin.repo.interface";
import { inject, injectable } from "tsyringe";

//////////////////////////////////////////////////////////

@injectable()
export class SenseDeviceAdminService {

    constructor (
        @inject('ISenseDeviceAdminRepo') private _senseDeviceAdminRepo: ISenseDeviceAdminRepo
    ){}

    fetchAndStoreSenseDeviceAdminData = async () => {
        const senseDeviceVitalsUsageService = new SenseDeviceVitalsUsageService();
        const senseUsageData = await senseDeviceVitalsUsageService.searchAllUsage("year");
        if (senseUsageData) {
            await this._senseDeviceAdminRepo.create(senseUsageData);
        }
    };

    fetchAndStoreSenseDeviceClientAdminData = async (clientId: string) => {
        const senseDeviceVitalsUsageService = new SenseDeviceVitalsUsageService();
        const senseUsageData = await senseDeviceVitalsUsageService.searchUsageByClient(clientId, "year");
        if (senseUsageData) {
            await this._senseDeviceAdminRepo.create(senseUsageData);
        }
    };

}
