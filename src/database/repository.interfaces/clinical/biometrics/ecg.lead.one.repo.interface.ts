export interface IECGLeadOneRepo {

    create (createModel) : Promise<any>;

    storeECGLeadOneData(ecgOneLeadData) : Promise<any>;
}
