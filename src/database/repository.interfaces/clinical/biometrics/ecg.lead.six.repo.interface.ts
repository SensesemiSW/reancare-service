export interface IECGLeadSixRepo {

    create (createModel) : Promise<any>;

    storeECGLeadSixData(ecgOneLeadData) : Promise<any>;
}
