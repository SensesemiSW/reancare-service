import { IECGLeadTwelveRepo } from "../../../../../../database/repository.interfaces/clinical/biometrics/ecg.lead.twelve.repo.interface";
import EcgTwelveLead from "../../../models/clinical/biometrics/ecg.twelve.model";
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';

///////////////////////////////////////////////////////////

export class ECGLeadTwelveRepo implements IECGLeadTwelveRepo {
    
    create = async (createModel): Promise<any> => {
        try {
            const entity = {
                PatientId      : createModel.PatientId,
                DeviceName     : createModel.DeviceType,
                CalculatedData : createModel.CalculatedData,
                ImageUrl       : createModel.ImageUrl,
            };

            const ecgTwelveLead = await EcgTwelveLead.create(entity);
            return ecgTwelveLead;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    storeECGLeadTwelveData = async (ecgData): Promise<any> => {
        try {
            for (const record of ecgData) {
                const existingRecord = await EcgTwelveLead.findOne({
                    where : { RefId: record.id }
                });

                if (!existingRecord) {
                    await EcgTwelveLead.create({
                        RefId          : record.id,
                        PatientId      : record.PatientId,
                        DeviceName     : "SenseH",
                        CalculatedData : record.CalculatedData,
                        ImageUrl       : record.ImageUrl,
                    });
                }
            }
            Logger.instance().log('ECG twelve lead data stored successfully.');
        } catch (error) {
            Logger.instance().log('Error storing ECG twelve lead data: ' + error.message);
            throw new ApiError(500, 'Error storing ECG twelve lead data: ' + error.message);
        }
    };

}
