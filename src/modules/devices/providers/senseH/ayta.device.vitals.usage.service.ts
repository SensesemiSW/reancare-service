import { Logger } from "../../../../common/logger";
import axios from "axios";
import { ISenseDeviceVitalsUsageService } from "../../interfaces/ayta.usage.service.interface";

const SENSE_TOKEN = process.env.SENSE_TOKEN || '';
const SENSE_BASE_URL = process.env.SENSE_BASE_URL || '';

export class SenseDeviceVitalsUsageService implements ISenseDeviceVitalsUsageService {

    // Search usage data for a client
    public async searchUsageByClient(clientId: string, current: string): Promise<any | null> {
        return fetchUsageDataById('usage/search', current, clientId);
    }
    
    // Search usage data all clients
    public async searchAllUsage(current: string): Promise<any | null> {
        return fetchAllUsageData('usage/search-all', current);
    }

}

//#region private

const fetchAllUsageData = async (endpoint: string, current: string): Promise<any | null> => {
    const url = `${SENSE_BASE_URL}/${endpoint}?current=${current}`;
    const headers = { 'Authorization': `Bearer ${SENSE_TOKEN}` };

    try {
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
            return response.data.Data.Records.Data;
        } else {
            Logger.instance().error(`Error fetching data from ${endpoint}`, response.status, null);
            return null;
        }
    } catch (error) {
        Logger.instance().error(`Error fetching data from ${endpoint}: ${error.message}`, null, null);
        return null;
    }
};

const fetchUsageDataById = async (endpoint: string, current: string, clientId: string): Promise<any | null> => {
    const url = `${SENSE_BASE_URL}/${endpoint}?current=${current}&clientId=${clientId}`;
    const headers = { 'Authorization': `Bearer ${SENSE_TOKEN}` };

    try {
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
            return response.data.Data.Records.Data;
        } else {
            Logger.instance().error(`Error fetching data from ${endpoint}`, response.status, null);
            return null;
        }
    } catch (error) {
        Logger.instance().error(`Error fetching data from ${endpoint}: ${error.message}`, null, null);
        return null;
    }
};

