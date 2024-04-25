import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { getBackgroundRabbitMQConnection } from '../../src.bg/rabbitmq/rabbitmq.connection';
import { AwardsFactsService } from '../../src.bg/modules/awards.facts/awards.facts.service'
import { EHRAnalyticsHandler } from '../modules/ehr.analytics/ehr.analytics.handler';
import { BloodGlucoseService } from '../../../src/services/clinical/biometrics/blood.glucose.service';
// import { EHRVitalService } from '../modules/ehr.analytics/ehr.service';
import { EHRVitalService } from '../modules/ehr.analytics/ehr.services/ehr.vital.service';
import { BodyHeightService } from '../../../src/services/clinical/biometrics/body.height.service';
import { BloodOxygenSaturationService } from '../../../src/services/clinical/biometrics/blood.oxygen.saturation.service';
import { BloodPressureService } from '../../../src/services/clinical/biometrics/blood.pressure.service';
import { AssessmentService } from '../../../src/services/clinical/assessment/assessment.service';
import { DailyAssessmentService } from '../../../src/services/clinical/daily.assessment/daily.assessment.service';
import { EHRLabService } from '../modules/ehr.analytics/ehr.services/ehr.lab.service';
import { LabRecordService } from '../../../src/services/clinical/lab.record/lab.record.service';
import { ILabRecordRepo } from "../../../src/database/repository.interfaces/clinical/lab.record/lab.record.interface";
import { EHRMedicationService } from '../modules/ehr.analytics/ehr.services/ehr.medication.service';
import { EHRHowDoYouFeelService } from '../modules/ehr.analytics/ehr.services/ehr.how.do.you.feel.service'
import { EHRAssessmentService } from '../modules/ehr.analytics/ehr.services/ehr.assessment.service';
import { EHRCareplanActivityService } from '../modules/ehr.analytics/ehr.services/ehr.careplan.activity.service';
import { EHRMentalWellBeingService } from '../modules/ehr.analytics/ehr.services/ehr.mental.wellbeing.service';
import { EHRNutritionService } from '../modules/ehr.analytics/ehr.services/ehr.nutrition.service';
import { EHRPatientService } from '../modules/ehr.analytics/ehr.services/ehr.patient.service';
import { EHRPhysicalActivityService } from '../modules/ehr.analytics/ehr.services/ehr.physical.activity.service';
import { EHRUserTaskService } from '../modules/ehr.analytics/ehr.services/ehr.user.task.service';
import { container } from 'tsyringe';

///////////////////////////////////////////////////////////////////////////////////////////


// awards facts
async function consumeAwardFromQueue(queueName: string, processFunction: Function): Promise<void> {
    try {
        const connection = getBackgroundRabbitMQConnection();
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        channel.consume(queueName, async (message) => {
            if (message !== null) {
                try {
                    const messageContent = JSON.parse(message.content.toString());

                    if (typeof messageContent.RecordDate === 'number') {
                        messageContent.RecordDate = new Date(messageContent.RecordDate);
                    }

                    await processFunction(messageContent);

                    channel.ack(message);
                } catch (error) {
                    console.error('Error processing message from RabbitMQ:', error);
                    channel.nack(message);
                }
            }
        });
    } catch (error) {
        console.error('Error consuming messages from RabbitMQ:', error);
        throw error;
    }
}

export async function consumeMarkListAsTakenMedicationFactsFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.MARK_LIST_AS_TAKEN_MEDICATION_QUEUE, AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeMarkListAsMissedMedicationFactsFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.MARK_LIST_AS_MISSED_MEDICATION_QUEUE, AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeMarkAsTakenMedicationFactsFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.MARK_AS_TAKEN_MEDICATION_QUEUE, AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeMarkAsMissedMedicationFactsFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.MARK_AS_MISSED_MEDICATION_QUEUE, AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeAddBloodGlucoseFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_BODY_GLUCOSE_QUEUE, AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeUpdateBloodGlucoseFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.UPDATE_BODY_GLUCOSE_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddBloodOxygenSaturationFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_BLOOD_OXYGEN_SATURATION_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdateBloodOxygenSaturationFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.UPDATE_BLOOD_OXYGEN_SATURATION_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddBloodPressureFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_BLOOD_PRESSURE_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdateBloodPressureFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.UPDATE_BLOOD_PRESSURE_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddBodyTemperatureFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_BODY_TEMPERATURE_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdateBodyTemperatureFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.UPDATE_BODY_TEMPERATURE_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddBodyWeightFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_BODY_WEIGHT_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdateBodyWeightFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.UPDATE_BODY_WEIGHT_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddPulseFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_PULSE_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdatePulseFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.UPDATE_PULSE_QUEUE, AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddSleepFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_SLEEP_QUEUE, AwardsFactsService.addOrUpdateMentalHealthResponseFact);
}

export async function consumeAddMedicationFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_MEDICATION_QUEUE, AwardsFactsService.addOrUpdateMentalHealthResponseFact);
}

export async function consumeAddPhysicalActivityFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_PHYSICAL_ACTIVITY_QUEUE, AwardsFactsService.addOrUpdatePhysicalActivityResponseFact);
}

export async function consumeUpdatePhysicalActivityFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.UPDATE_PHYSICAL_ACTIVITY_QUEUE, AwardsFactsService.addOrUpdatePhysicalActivityResponseFact);
}

export async function consumeAddFoodConsumptionFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.ADD_FOOD_CONSUMPTION_QUEUE, AwardsFactsService.addOrUpdateNutritionResponseFact);
}

export async function consumeUpdateFoodConsumptionFromQueue(): Promise<void> {
    await consumeAwardFromQueue(process.env.UPDATE_FOOD_CONSUMPTION_QUEUE, AwardsFactsService.addOrUpdateNutritionResponseFact);
}


//EHR Vital

async function consumeEHRFromQueue(queueName: string, processMessage: Function): Promise<void> {
    try {
        const connection = getBackgroundRabbitMQConnection();
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        channel.consume(queueName, async (message) => {
            if (message !== null) {
                try {
                    const messageContent = JSON.parse(message.content.toString());

                    await processMessage(messageContent);

                    console.log("message receiced from" + queueName)

                    channel.ack(message);
                } catch (error) {
                    console.error('Error processing message from RabbitMQ:', error);
                    channel.nack(message);
                }
            }
        });
    } catch (error) {
        console.error('Error consuming messages from RabbitMQ:', error);
        throw error;
    }
}

// Blood Saturation EHR messages
export async function consumeAddOxygenSaturationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_BLOOD_SATURATION_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        await eHRVitalService.addEHRBloodOxygenSaturationForAppNames(messageContent);
    });
}

export async function consumeUpdateOxygenSaturationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_BLOOD_SATURATION_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        await eHRVitalService.addEHRBloodOxygenSaturationForAppNames(messageContent);
    });
}

export async function consumeDeleteBloodOxygenSaturationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_BLOOD_OXYGEN_SATURATION_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.deleteRecord(messageContent);
    });
}

// Blood Glucose EHR messages
export async function consumeAddBloodGlucoseEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_BLOOD_GLUCOSE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        await eHRVitalService.addEHRBloodGlucoseForAppNames(messageContent);
    });
}

export async function consumeUpdateBloodGlucoseEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_BLOOD_GLUCOSE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        await eHRVitalService.addEHRBloodGlucoseForAppNames(messageContent);
    });
}

export async function consumeDeleteBloodGlucoseEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_BLOOD_GLUCOSE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.deleteRecord(messageContent);
    });
}

// Blood Pressure EHR messages
export async function consumeAddBloodPressureEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_BLOOD_PRESSURE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRBloodPressureForAppNames(messageContent);
    });
}

export async function consumeUpdateBloodPressureEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_BLOOD_PRESSURE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRBloodPressureForAppNames(messageContent);
    });
}

export async function consumeDeleteBloodPressureEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_BLOOD_PRESSURE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.deleteRecord(messageContent);
    });
}

// Body Height EHR messages
export async function consumeAddBodyHeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_BODY_HEIGHT_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRBodyHeightForAppNames(messageContent);
    });
}

export async function consumeUpdateBodyHeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_BODY_HEIGHT_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRBodyHeightForAppNames(messageContent);
    });
}

export async function consumeDeleteBodyHeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_BODY_HEIGHT_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.deleteRecord(messageContent);
    });
}

// Body Weight EHR messages
export async function consumeAddBodyWeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_BODY_WEIGHT_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRBodyWeightForAppNames(messageContent);
    });
}

export async function consumeUpdateBodyWeighttEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_BODY_WEIGHT_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRBodyWeightForAppNames(messageContent);
    });
}

export async function consumeDeleteBodyWeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_BODY_WEIGHT_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.deleteRecord(messageContent);
    });
}

// Body Temperature EHR messages
export async function consumeAddBodyTempEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_BODY_TEMPERATURE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRBodyTemperatureForAppNames(messageContent);
    });
}

export async function consumeUpdateBodyTempEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_BODY_TEMPERATURE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRBodyTemperatureForAppNames(messageContent);
    });
}

export async function consumeDeleteBodyTemperatureEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_BODY_TEMPERATURE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.deleteRecord(messageContent);
    });
}

// Pulse Control EHR messages
export async function consumeAddPulseEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_PULSE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRPulseForAppNames(messageContent);
    });
}

export async function consumeUpdatePulsetEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_PULSE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.addEHRPulseForAppNames(messageContent);
    });
}

export async function consumeDeletePulseControleEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_PULSE_CONTROLE_EHR_QUEUE, async (messageContent) => {
        const eHRVitalService = container.resolve(EHRVitalService);
        eHRVitalService.deleteRecord(messageContent);
    });
}

// Lab Record EHR messages
export async function consumeAddLabRecordEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_LAB_RECORD_EHR_QUEUE, async (messageContent) => {
        const ehrLabService = new EHRLabService();
        ehrLabService.addEHRLabRecordForAppNames(messageContent);
    });
}

export async function consumeUpdateLabRecordEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_LAB_RECORD_EHR_QUEUE, async (messageContent) => {
        const ehrLabService = new EHRLabService();
        ehrLabService.addEHRLabRecordForAppNames(messageContent);
    });
}

export async function consumeDeleteLabRecordEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_LAB_RECORD_EHR_QUEUE, async (messageContent) => {
        const eHRLabService = new EHRLabService();
        eHRLabService.deleteLabEHRRecord(messageContent);
    });
}

// Medication EHR messages
export async function consumeAddMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_MEDICATION_EHR_QUEUE, async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeDeleteMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_MEDICATION_RECORD_EHR_QUEUE, async (messageContent) => {
        const eHRMedicationService = new EHRMedicationService();
        eHRMedicationService.deleteMedicationEHRRecords(messageContent);
    });
}

export async function consumeMarkListAsMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.EHR_MARK_LIST_AS_TAKEN_MEDICATION_QUEUE, async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeMarkListAsMissedMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.EHR_MARK_LIST_AS_MISSED_MEDICATION_QUEUE, async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeMarkAsTakenMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.EHR_MARK_AS_TAKEN_MEDICATION_QUEUE, async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeMarkAsMissedMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.EHR_MARK_AS_MISSED_MEDICATION_QUEUE, async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeAnswerQuestionEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ANSWER_QUESTION_EHR_QUEUE, async (messageContent) => {
        const ehrAssessmentService = new EHRAssessmentService();
        ehrAssessmentService.addEHRRecordForAppNames(messageContent);
    });
}

export async function consumeAnswerQuestionListEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ANSWER_QUESTION_LIST_EHR_QUEUE, async (messageContent) => {
        const ehrAssessmentService = new EHRAssessmentService();
        ehrAssessmentService.addEHRRecordForAppNames(messageContent);
    });
}

export async function consumeAddDailyAssessmentEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_DAILY_ASSESSEMENT_EHR_QUEUE, async (messageContent) => {
        const ehrHowDoYouFeelService = new EHRHowDoYouFeelService();
        ehrHowDoYouFeelService.addEHRDailyAssessmentForAppNames(messageContent);
    });
}

export async function consumeEnrolAndCreateTaskEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ENROL_AND_CREATE_TASK_EHR_QUEUE, async (messageContent) => {
        const ehrCareplanActivityService = new EHRCareplanActivityService();
        ehrCareplanActivityService.addCareplanActivitiesToEHR(messageContent.CareplanActivities, messageContent.PatientDetails);
    });
}

export async function consumeAddHowDoYouFeelEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_HOW_DO_YOU_FEEL_EHR_QUEUE, async (messageContent) => {
        const ehrHowDoYouFeelService = new EHRHowDoYouFeelService();
        ehrHowDoYouFeelService.addEHRHowDoYouFeelForAppNames(messageContent);
    });
}

export async function consumeUpdateHowDoYouFeelEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_HOW_DO_YOU_FEEL_EHR_QUEUE, async (messageContent) => {
        const ehrHowDoYouFeelService = new EHRHowDoYouFeelService();
        ehrHowDoYouFeelService.addEHRHowDoYouFeelForAppNames(messageContent);
    });
}

export async function consumeAddSleepEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_SLEEP_EHR_QUEUE, async (messageContent) => {
        const ehrMentalWellBeingService = new EHRMentalWellBeingService();
        ehrMentalWellBeingService.addEHRSleepForAppNames(messageContent);
    });
}

export async function consumeAddMeditationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_MEDITATION_EHR_QUEUE, async (messageContent) => {
        const ehrMentalWellBeingService = new EHRMentalWellBeingService();
        ehrMentalWellBeingService.addEHRMeditationForAppNames(messageContent);
    });
}

export async function consumeUpdateMeditationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_MEDITATION_EHR_QUEUE, async (messageContent) => {
        const ehrMentalWellBeingService = new EHRMentalWellBeingService();
        ehrMentalWellBeingService.addEHRMeditationForAppNames(messageContent);
    });
}

export async function consumeAddFoodConsumptionEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_FOOD_CONSUMPTION_EHR_QUEUE, async (messageContent) => {
        const ehrNutritionService = new EHRNutritionService();
        ehrNutritionService.addEHRRecordNutritionForAppNames(messageContent);
    });
}

export async function consumeAddEmergencyContactEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_EMERGENCY_CONTACT_EHR_QUEUE, async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.addEHRRecordEmergencyContactForAppNames(messageContent);
    });
}

export async function consumeUpdateHealthProfileByPatientUserIdEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_HEALTH_PROFILE_BY_PATIENTUSERID_EHR_QUEUE, async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.addEHRRecordHealthProfileForAppNames(messageContent);
    });
}

export async function consumeAddPatientEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_PATIENT_EHR_QUEUE, async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.addEHRRecordPatientForAppNames(messageContent);
    });
}

export async function consumeUpdatePatientEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_PATIENT_EHR_QUEUE, async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.addEHRRecordPatientForAppNames(messageContent);
    });
}

export async function consumeDeletePatientEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.DELETE_PATIENT_EHR_QUEUE, async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.deleteStaticEHRRecord(messageContent);
    });
}

// Physical Activity EHR messages
export async function consumeAddStandEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_STAND_EHR_QUEUE, async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordStandForAppNames(messageContent);
    });
}

export async function consumeUpdateStandEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_STAND_EHR_QUEUE, async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordStandForAppNames(messageContent);
    });
}

export async function consumeAddStepCountEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_STEP_COUNT_EHR_QUEUE, async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordStepCountForAppNames(messageContent);
    });
}

export async function consumeUpdateStepCountEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_STEP_COUNT_EHR_QUEUE, async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordStepCountForAppNames(messageContent);
    });
}

export async function consumeAddPhysicalActivityEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.ADD_PHYSICAL_ACTIVITY_EHR_QUEUE, async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordPhysicalActivityForAppNames(messageContent);
    });
}

export async function consumeUpdatePhysicalActivityEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.UPDATE_PHYSICAL_ACTIVITY_EHR_QUEUE, async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordPhysicalActivityForAppNames(messageContent);
    });
}

export async function consumeUserFinishTaskEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue(process.env.USER_FINISH_TASK_EHR_QUEUE, async (messageContent) => {
        const ehrUserTaskService = new EHRUserTaskService();
        ehrUserTaskService.addEHRUserTaskForAppNames(messageContent.Updated, messageContent.HealthSystem);
    });
}



export async function initializebgrabbitconsumer() {
    //awards
    await consumeAddBloodGlucoseFromQueue()
    await consumeUpdateBloodGlucoseFromQueue()
    await consumeAddBloodOxygenSaturationFromQueue()
    await consumeUpdateBloodOxygenSaturationFromQueue()
    await consumeAddBloodPressureFromQueue()
    await consumeUpdateBloodPressureFromQueue()
    await consumeAddBodyTemperatureFromQueue()
    await consumeUpdateBodyTemperatureFromQueue()
    await consumeAddBodyWeightFromQueue()
    await consumeUpdateBodyWeightFromQueue()
    await consumeAddPulseFromQueue()
    await consumeUpdatePulseFromQueue()
    await consumeMarkListAsTakenMedicationFactsFromQueue()
    await consumeMarkListAsMissedMedicationFactsFromQueue()
    await consumeMarkAsTakenMedicationFactsFromQueue()
    await consumeMarkAsMissedMedicationFactsFromQueue()
    await consumeAddSleepFromQueue()
    await consumeAddMedicationFromQueue()
    await consumeAddPhysicalActivityFromQueue()
    await consumeUpdatePhysicalActivityFromQueue()
    await consumeAddFoodConsumptionFromQueue()
    await consumeUpdateFoodConsumptionFromQueue()
    // EHR 
    await consumeAddBloodGlucoseEHRFromQueue()
    await consumeUpdateBloodGlucoseEHRFromQueue()
    await consumeDeleteBloodGlucoseEHRFromQueue()
    await consumeAddOxygenSaturationEHRFromQueue()
    await consumeUpdateOxygenSaturationEHRFromQueue()
    await consumeDeleteBloodOxygenSaturationEHRFromQueue()
    await consumeAddBloodPressureEHRFromQueue()
    await consumeUpdateBloodPressureEHRFromQueue()
    await consumeDeleteBloodPressureEHRFromQueue()
    await consumeAddBodyHeightEHRFromQueue()
    await consumeUpdateBodyHeightEHRFromQueue()
    await consumeDeleteBodyHeightEHRFromQueue()
    await consumeDeleteBodyTemperatureEHRFromQueue()
    await consumeDeleteBodyWeightEHRFromQueue()
    await consumeDeletePulseControleEHRFromQueue()
    await consumeAnswerQuestionListEHRFromQueue()
    await consumeAddDailyAssessmentEHRFromQueue()
    await consumeAddLabRecordEHRFromQueue()
    await consumeUpdateLabRecordEHRFromQueue()
    await consumeDeleteLabRecordEHRFromQueue()
    await consumeDeleteMedicationEHRFromQueue()
    await consumeEnrolAndCreateTaskEHRFromQueue()
    await consumeAddHowDoYouFeelEHRFromQueue()
    await consumeUpdateHowDoYouFeelEHRFromQueue()
    await consumeAddSleepEHRFromQueue()
    await consumeAddMeditationEHRFromQueue()
    await consumeUpdateMeditationEHRFromQueue()
    await consumeAddEmergencyContactEHRFromQueue()
    await consumeUpdateHealthProfileByPatientUserIdEHRFromQueue()
    await consumeAddPatientEHRFromQueue()
    await consumeUpdatePatientEHRFromQueue()
    await consumeDeletePatientEHRFromQueue()
    await consumeAddStandEHRFromQueue()
    await consumeUpdateStandEHRFromQueue()
    await consumeAddStepCountEHRFromQueue()
    await consumeUpdateStepCountEHRFromQueue()
    await consumeAddPhysicalActivityEHRFromQueue()
    await consumeUpdatePhysicalActivityEHRFromQueue()
    await consumeUserFinishTaskEHRFromQueue()
}