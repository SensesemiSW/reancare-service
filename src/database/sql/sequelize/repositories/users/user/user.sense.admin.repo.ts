import { ISenseDeviceAdminRepo } from "../../../../../../database/repository.interfaces/users/user/user.sense.admin.repo.interface";
import SenseUsageEvents from "../../../models/users/user/user.sense.admin.model";
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';

///////////////////////////////////////////////////////////

export class SenseDeviceAdminRepo implements ISenseDeviceAdminRepo {
    
    create = async (createModels: any[]): Promise<any> => {
        try {
            const results = [];
            
            for (const createModel of createModels) {
                const [usage, created] = await SenseUsageEvents.upsert(
                    {
                        ClientId   : createModel.ClientId,
                        RecordId   : createModel.RecordId,
                        RecordType : createModel.RecordType,
                        DeviceId   : createModel.DeviceId,
                        DeviceType : createModel.DeviceType
                    }
                );
                results.push({ usage, created });
            }

            return results;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
