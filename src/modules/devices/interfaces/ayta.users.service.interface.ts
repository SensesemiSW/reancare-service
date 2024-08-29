export interface ISenseDeviceVitalsService {
    searchBp(patientId: string, current: string): Promise<string>;

    searchSpo2(patientId: string, current: string): Promise<string>;

    searchEcgOneLead(patientId: string, current: string): Promise<string>;

    searchEcgSixLead(patientId: string, current: string): Promise<string>;

    searchEcgTwelveLead(patientId: string, current: string): Promise<string>;

    getBpById(id: string);

    getSpo2ById(id: string);

    getEcgOneLeadById(id: string);

    getEcgSixLeadById(id: string);

    getEcgTwelveLeadById(id: string)

}
