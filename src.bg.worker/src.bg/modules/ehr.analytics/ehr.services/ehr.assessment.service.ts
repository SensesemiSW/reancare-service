import { injectable } from "tsyringe";
import { Logger } from "../../../../../src/common/logger";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { AssessmentTemplateService } from "../../../../../src/services/clinical/assessment/assessment.template.service";
import { AssessmentService } from "../../../../../src/services/clinical/assessment/assessment.service";
import { PatientService } from "../../../../../src/services/users/patient/patient.service";
import { Injector } from "../../../../../src/startup/injector";
import { PatientAppNameCache } from "../patient.appname.cache";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRAssessmentService {

    _patientService = Injector.Container.resolve(PatientService);

    _assessmentService = Injector.Container.resolve(AssessmentService);

    _assessmentTemplateService = Injector.Container.resolve(AssessmentTemplateService);

    // public addEHRRecord = async (answerResponse: any, assessment?: any, options?: any, appName?: string ) => {
    //     Logger.instance().log(`AnswerResponse: ${JSON.stringify(answerResponse)}`);
    //     Logger.instance().log(`Assessment: ${JSON.stringify(assessment, null, 2)}`);
    //     var assessmentRecord = {
    //         AppName        : appName,
    //         PatientUserId  : assessment.PatientUserId,
    //         AssessmentId   : assessment.id,
    //         TemplateId     : assessment.AssessmentTemplateId,
    //         NodeId         : answerResponse ? answerResponse.Answer.NodeId : null,
    //         Title          : assessment.Title,
    //         Question       : answerResponse ? answerResponse.Answer.Title : null,
    //         SubQuestion    : answerResponse && answerResponse.Answer.SubQuestion ?
    //              answerResponse.Answer.SubQuestion : null,
    //         QuestionType   : answerResponse ? answerResponse.Answer.ResponseType : null,
    //         AnswerOptions  : options ? JSON.stringify(options.Options) : null,
    //         AnswerValue    : null,
    //         AnswerReceived : null,
    //         AnsweredOn     : assessment.CreatedAt,
    //         Status         : assessment.Status ?? null,
    //         Score          : assessment.Score ?? null,
    //         AdditionalInfo : null,
    //         StartedAt      : assessment.StartedAt ?? null,
    //         FinishedAt     : assessment.FinishedAt ?? null,
    //         RecordDate     : assessment.CreatedAt ? new Date(assessment.CreatedAt) : null
    //     };
    //     Logger.instance().log(`AssessmentRecord: ${JSON.stringify(assessmentRecord, null, 2)}`);
    //     if (answerResponse && answerResponse.Answer.ResponseType === 'Single Choice Selection') {
    //         assessmentRecord['AnswerValue'] = answerResponse.Answer.ChosenOption.Sequence;
    //         assessmentRecord['AnswerReceived'] = answerResponse.Answer.ChosenOption.Text;
    //         EHRAnalyticsHandler.addAssessmentRecord(assessmentRecord);
    //     } else if (answerResponse && answerResponse.Answer.ResponseType === 'Multi Choice Selection') {
    //         var responses = answerResponse.Answer.ChosenOptions;
    //         for await (var r of responses) {
    //             assessmentRecord['AnswerValue'] = r.Sequence;
    //             assessmentRecord['AnswerReceived'] = r.Text;
    //             var a = JSON.parse(JSON.stringify(assessmentRecord));
    //             EHRAnalyticsHandler.addAssessmentRecord(a);
    //         }
    //     } else {
    //         EHRAnalyticsHandler.addAssessmentRecord(assessmentRecord);
    //     }
    // };

    public addEHRRecord = async (assessment: any, appName?: string ) => {

        Logger.instance().log(`AnswerResponse: ${JSON.stringify(assessment)}`);

        var assessmentRecord = {
            AppName        : appName,
            PatientUserId  : assessment.PatientUserId,
            AssessmentId   : assessment.id,
            TemplateId     : assessment.AssessmentTemplateId,
            NodeId         : null,
            Title          : assessment.Title,
            Question       : null,
            SubQuestion    : null,
            QuestionType   : null,
            AnswerOptions  : null,
            AnswerValue    : null,
            AnswerReceived : null,
            AnsweredOn     : null,
            Status         : assessment.Status ?? null,
            Score          : JSON.stringify(assessment.ScoreDetails) ?? null,
            AdditionalInfo : null,
            StartedAt      : assessment.StartedAt ?? null,
            FinishedAt     : assessment.FinishedAt ?? null,
            RecordDate     : assessment.CreatedAt ? new Date(assessment.CreatedAt) : null
        };

        Logger.instance().log(`AssessmentRecord: ${JSON.stringify(assessmentRecord, null, 2)}`);

        if (assessment.Status === 'Pending') {
            EHRAnalyticsHandler.addAssessmentRecord(assessmentRecord);
        } else {
            for await (var ur of assessment.UserResponses) {

                if (ur.Node && ur.Node.QueryResponseType === 'Single Choice Selection') {
                    ur.Additional = JSON.parse(ur.Additional);
                    assessmentRecord['AnswerValue'] = ur.Additional.Sequence;
                    assessmentRecord['AnswerReceived'] = ur.Additional.Text;
                    assessmentRecord['NodeId'] = ur.NodeId;
                    assessmentRecord['Question'] = ur.Node.Title;
                    assessmentRecord['QuestionType'] = ur.Node.QueryResponseType;
                    assessmentRecord['SubQuestion']  = null;
                    assessmentRecord['AnswerOptions']  = JSON.stringify(ur.Additional);
                    assessmentRecord['AnsweredOn']  = ur.CreatedAt;

                    var listNode = await this._assessmentTemplateService.getNode(ur.Node.ParentNodeId);
                    if (listNode && listNode.ServeListNodeChildrenAtOnce) {
                        assessmentRecord['SubQuestion']  = ur.Node.Title;
                        assessmentRecord['Question']  = listNode.Title;
                    }

                    var a = JSON.parse(JSON.stringify(assessmentRecord));
                    EHRAnalyticsHandler.addAssessmentRecord(a);
                } else if (ur && ur.Node.QueryResponseType === 'Multi Choice Selection') {
                    ur.Additional = JSON.parse(ur.Additional);
                    for await (var i of ur.Additional) {
                        assessmentRecord['AnswerValue'] = i.Sequence;
                        assessmentRecord['AnswerReceived'] = i.Text;
                        assessmentRecord['NodeId'] = ur.NodeId;
                        assessmentRecord['Question'] = ur.Node.Title;
                        assessmentRecord['QuestionType'] = ur.Node.QueryResponseType;
                        assessmentRecord['AnswerOptions']  = JSON.stringify(ur.Additional);
                        assessmentRecord['AnsweredOn']  = ur.CreatedAt;
                        var a = JSON.parse(JSON.stringify(assessmentRecord));
                        EHRAnalyticsHandler.addAssessmentRecord(a);
                    }
                } else {
                    assessmentRecord['AnswerValue'] = ur.TextValue;
                    assessmentRecord['AnswerReceived'] = ur.TextValue;
                    assessmentRecord['NodeId'] = ur.NodeId;
                    assessmentRecord['Question'] = ur.Node.Title;
                    assessmentRecord['QuestionType'] = ur.Node.QueryResponseType;
                    assessmentRecord['SubQuestion']  = null;
                    assessmentRecord['AnswerOptions']  = null;
                    assessmentRecord['AnsweredOn']  = ur.CreatedAt;
                    var a = JSON.parse(JSON.stringify(assessmentRecord));
                    EHRAnalyticsHandler.addAssessmentRecord(a);
                }
            }
        }
    };

    public addEHRRecordForAppNames = async (assessment: any) => {
        var appNames = await PatientAppNameCache.get(assessment.PatientUserId);
        for await (var appName of appNames) {
            this.addEHRRecord(assessment, appName);
        }
    };

}
