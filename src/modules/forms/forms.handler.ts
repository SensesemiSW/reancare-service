import { CAssessmentTemplate } from "../../domain.types/clinical/assessment/assessment.types";
import Dictionary from "../../common/dictionary";
import { FormDto } from "../../domain.types/clinical/assessment/form.types";
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from "../../domain.types/thirdparty/thirdparty.api.credentials";
import { IFormsService } from "./interfaces/forms.service.interface";
import { ProviderResolver } from "./provider.resolver";

////////////////////////////////////////////////////////////////////////

export class FormsHandler {

    static _services: Dictionary<IFormsService> = new Dictionary<IFormsService>();

    public static connect = async (connectionModel: ThirdpartyApiCredentialsDomainModel): Promise<boolean> => {
        var service = FormsHandler.getService(connectionModel);
        return await service.connect(connectionModel);
    };

    public static getFormsList = async (connectionModel: ThirdpartyApiCredentialsDto): Promise<FormDto[]> => {
        var service = FormsHandler.getService(connectionModel);
        return await service.getFormsList(connectionModel);
    };

    public static formExists =
        async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string): Promise<boolean> => {
            var service = FormsHandler.getService(connectionModel);
            return await service.formExists(connectionModel, providerFormId);
        };

    public static importFormFileAsAssessmentTemplate =
        async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string, downloadedFilepath: string)
            : Promise<CAssessmentTemplate> => {
            var service = FormsHandler.getService(connectionModel);
            return await service.importFormFileAsAssessmentTemplate(
                connectionModel.UserId, providerFormId, downloadedFilepath);
        };

    public static downloadForm = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<string> => {
        var service = FormsHandler.getService(connectionModel);
        return await service.downloadForm(connectionModel, providerFormId);
    };

    public static importFormSubmissions = async (
        connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string): Promise<any[]> => {
        var service = FormsHandler.getService(connectionModel);
        return await service.importFormSubmissions(connectionModel, providerFormId);
    }
    
    // public convertFormToAssessmentTemplate = async (assessmentActivity: CareplanActivity)
    //     : Promise<SAssessmentTemplate> => {
    //     var service = FormsHandler._services.getItem(assessmentActivity.Provider);
    //     return await service.convertToAssessmentTemplate(assessmentActivity);
    // };

    // public convertFormResponseToAssessmentResponse = async (assessmentActivity: CareplanActivity)
    // : Promise<SAssessmentTemplate> => {
    //     var service = FormsHandler._services.getItem(assessmentActivity.Provider);
    //     return await service.convertToAssessmentTemplate(assessmentActivity);
    // };

    private static getService(connectionModel: ThirdpartyApiCredentialsDomainModel) {
        const provider = connectionModel.Provider;
        FormsHandler._services = ProviderResolver.resolve();
        var service = FormsHandler._services.getItem(provider);
        return service;
    }

}
