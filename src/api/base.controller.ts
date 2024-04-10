
import express from "express";
import { uuid } from "../domain.types/miscellaneous/system.types";
import { ApiError } from "../common/api.error";
import { PermissionHandler } from "../auth/custom/permission.handler";
import { TenantService } from "../services/tenant/tenant.service";
import { Injector } from "../startup/injector";
import { UserService } from "../services/users/user/user.service";

///////////////////////////////////////////////////////////////////////////////////////

export class BaseController {

    //#region member variables and constructors
   
    //#endregion

    public authorizeOne = async (
        request: express.Request,
        resourceOwnerUserId?: uuid,
        resourceTenantId?: uuid): Promise<void> => {

        let ownerUserId = resourceOwnerUserId ?? null;
        let tenantId = resourceTenantId ?? null;

        // ownerUserId = ownerUserId ?? request.currentUser?.UserId;

        if (ownerUserId) {
            const userService = Injector.Container.resolve(UserService);
            var user = await userService.getById(ownerUserId);
            if (user) {
                ownerUserId = user.id;
                tenantId = tenantId ?? user.TenantId;
            }
        }

        if (tenantId == null) {
            // If tenant is not provided, get the default tenant
            const tenantService = Injector.Container.resolve(TenantService);
            var tenant = await tenantService.getTenantWithCode('default');
            if (tenant) {
                tenantId = tenant.id;
            }
        }

        request.resourceOwnerUserId = ownerUserId;
        request.resourceTenantId = tenantId;

        const permitted = await PermissionHandler.checkFineGrained(request);
        if (!permitted) {
            throw new ApiError(403, 'Permission denied.');
        }
    };

}
