import { IECGLeadSixRepo } from "../../../../../../database/repository.interfaces/clinical/biometrics/ecg.lead.six.repo.interface";
import EcgSixLead from "../../../models/clinical/biometrics/ecg.six.lead.model";
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';

///////////////////////////////////////////////////////////

export class ECGLeadSixRepo implements IECGLeadSixRepo {

    create = async (createModel): Promise<any> => {
        try {
            const entity = {
                PatientId      : createModel.PatientId,
                DeviceName     : createModel.DeviceType,
                CalculatedData : createModel.CalculatedData,
                ImageUrl       : createModel.ImageUrl,
            };

            const ecgSixLead = await EcgSixLead.create(entity);
            return ecgSixLead;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    storeECGLeadSixData = async (ecgData): Promise<any> => {
        try {
            for (const record of ecgData) {
                const existingRecord = await EcgSixLead.findOne({
                    where : { RefId: record.id }
                });

                if (!existingRecord) {
                    await EcgSixLead.create({
                        RefId          : record.id,
                        PatientId      : record.PatientId,
                        DeviceName     : "SenseH",
                        CalculatedData : record.CalculatedData,
                        ImageUrl       : record.ImageUrl,
                    });
                }
            }
        } catch (error) {
            Logger.instance().log('Error storing ECG six lead data: ' + error.message);
            throw new ApiError(500, 'Error storing ECG six lead data: ' + error.message);
        }
    };

}
