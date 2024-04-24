import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DonorAuth {

    static readonly _baseContext = `Assorted.BloodDonation.Donor`;

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.Create`,
        Ownership      : ResourceOwnership.Tenant,
        ActionScope    : ActionScope.Public,
        RequestType    : RequestType.CreateOne,
        SignupOrSignin : true,
    };

    static updateByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateByUserId`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static deleteByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteByUserId`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static getByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetBByUserId`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.Search`,
        Ownership           : ResourceOwnership.Tenant,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

}
