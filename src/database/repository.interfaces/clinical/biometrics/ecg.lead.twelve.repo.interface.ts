export interface IECGLeadTwelveRepo {

    create (createModel) : Promise<any>;

    storeECGLeadTwelveData(ecgOneLeadData) : Promise<any>;
}
