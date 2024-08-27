import { IECGLeadOneRepo } from "../../../../../../database/repository.interfaces/clinical/biometrics/ecg.lead.one.repo.interface";
import EcgOneLead from "../../../models/clinical/biometrics/ecg.one.lead.model";
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';

///////////////////////////////////////////////////////////

export class ECGLeadOneRepo implements IECGLeadOneRepo {
    
    create = async (createModel):
    Promise<any> => {
        try {
            const entity = {
                PatientId      : createModel.PatientId,
                DeviceName     : createModel.DeviceType,
                CalculatedData : createModel.CalculatedData,
                ImageUrl       : createModel.ImageUrl,
            };

            const ecgOneLead = await EcgOneLead.create(entity);
            return ecgOneLead;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };
    
    storeECGLeadOneData = async (ecgData): Promise<any> => {
        try {
            for (const record of ecgData) {
                const existingRecord = await EcgOneLead.findOne({
                    where : { RefId: record.id }
                });

                if (!existingRecord) {
                    await EcgOneLead.create({
                        RefId          : record.id,
                        PatientId      : record.PatientId,
                        DeviceName     : "SenseH",
                        CalculatedData : record.CalculatedData,
                        ImageUrl       : record.ImageUrl,
                    });
                }
            }
            Logger.instance().log('ECG lead One data stored successfully.');
        } catch (error) {
            Logger.instance().log('Error storing ECG lead data: ' + error.message);
            throw new ApiError(500, 'Error storing ECG lead data: ' + error.message);
        }
    };

}
