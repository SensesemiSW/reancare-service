import axios from "axios";
import { Logger } from "../../../../common/logger";
import { ISenseDeviceVitalsService } from "../../interfaces/ayta.users.service.interface";

//////////////////////////////////////////////////////////////

export const API_KEY = process.env.SENSE_X_API_KEY || '';

export class SenseDeviceVitalsService implements ISenseDeviceVitalsService {

    public async searchBp(patientId: string, current: string = 'year'): Promise<any | null> {
        return fetchData('bp', 'BpRecords', patientId, current);
    }
    
    public async searchSpo2(patientId: string, current: string = 'year'): Promise<any | null> {
        return fetchData('spo2', 'Spo2Records', patientId, current);
    }
    
    public async searchEcgOneLead(patientId: string, current: string = 'year'): Promise<any | null> {
        return fetchData('ecg-one-lead', 'EcgRecords', patientId, current);
    }
    
    public async searchEcgSixLead(patientId: string, current: string = 'year'): Promise<any | null> {
        return fetchData('ecg-six-lead', 'EcgRecords', patientId, current);
    }

    public async searchEcgTwelveLead(patientId: string, current: string = 'year'): Promise<any | null> {
        return fetchData('ecg-six-lead', 'EcgRecords', patientId, current);
    }

    public async getBpById(id: string): Promise< any | null> {
        return fetchDataById('bp', id);
    }
    
    public async getSpo2ById(id: string): Promise< any | null> {
        return fetchDataById('spo2', id);
    }
    
    public async getEcgOneLeadById(id: string): Promise< any | null> {
        return fetchDataById('ecg-one-lead', id);
    }
    
    public async getEcgSixLeadById(id: string): Promise< any | null> {
        return fetchDataById('ecg-six-lead', id);
    }
    
    public async getEcgTwelveLeadById(id: string): Promise< any | null> {
        return fetchDataById('ecg-twelve-lead', id);
    }

}

//#region private

const fetchData = async (endpoint: string, recordType: string, patientId: string, current: string): Promise<any | null> => {
    const url = `${process.env.SENSE_BASE_URL}/device-records/${endpoint}/search?current=${current}&patientId=${patientId}`;
    const headers = { 'x-api-key': API_KEY };

    try {
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
            const records = response.data.Data[recordType].Records;
            
            records.forEach((record: any) => {
                record.PatientId = patientId;
            });

            return records;
        } else {
            Logger.instance().error(`Error fetching ${endpoint} data`, response.status, null);
            return null;
        }
    } catch (error) {
        Logger.instance().error(`Error fetching ${endpoint} data: ${error}`, null, null);
        return null;
    }
};

const fetchDataById = async (endpoint: string, id: string): Promise< any | null> => {

    const url = `${process.env.SENSE_BASE_URL}/device-records/${endpoint}/${id}`;
    const headers = { 'x-api-key': API_KEY };

    try {
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
            return response.data;
        } else {
            Logger.instance().error(`Error fetching ${endpoint} data`, response.status, null);
            return null;
        }
    } catch (error) {
        Logger.instance().error(`Error fetching ${endpoint} data: ${error}`, null, null);
        return null;
    }
};
