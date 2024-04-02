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

///////////////////////////////////////////////////////////////////////////////////////////


// awards facts
async function consumeAwardFromQueue(queueName: string, processFunction: Function): Promise<void> {
    try {
        // Create a channel from the connection
        const connection = getBackgroundRabbitMQConnection();
        const channel = await connection.createChannel();

        // Assert the queue to make sure it exists, otherwise create it
        await channel.assertQueue(queueName, { durable: true });

        // Set up the message consumer
        channel.consume(queueName, async (message) => {
            if (message !== null) {
                try {
                    // Parse the message
                    const messageContent = JSON.parse(message.content.toString());

                    // Convert RecordDate back to a Date object
                    if (typeof messageContent.RecordDate === 'number') {
                        messageContent.RecordDate = new Date(messageContent.RecordDate);
                    }

                    // Process the message using the provided function
                    await processFunction(messageContent);

                    // Acknowledge the message to remove it from the queue
                    channel.ack(message);
                } catch (error) {
                    console.error('Error processing message from RabbitMQ:', error);
                    // Reject and requeue the message
                    channel.nack(message);
                }
            }
        });
    } catch (error) {
        console.error('Error consuming messages from RabbitMQ:', error);
        throw error;
    }
}
async function consumeEHRFromQueue(queueName: string, processMessage: (messageContent: any) => Promise<void>): Promise<void> {
    try {
        // Create a channel from the connection
        const connection = getBackgroundRabbitMQConnection();
        const channel = await connection.createChannel();

        // Assert the queue to make sure it exists, otherwise create it
        await channel.assertQueue(queueName, { durable: true });

        // Set up the message consumer
        channel.consume(queueName, async (message) => {
            if (message !== null) {
                try {
                    // Parse the message
                    const messageContent = JSON.parse(message.content.toString());

                    // Process the message
                    await processMessage(messageContent);

                    // Acknowledge the message to remove it from the queue
                    channel.ack(message);
                } catch (error) {
                    console.error('Error processing message from RabbitMQ:', error);
                    // Reject and requeue the message
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
    await consumeAwardFromQueue('mark_list_as_taken_medication_queue', AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeMarkListAsMissedMedicationFactsFromQueue(): Promise<void> {
    await consumeAwardFromQueue('mark_list_as_missed_medication_queue', AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeMarkAsTakenMedicationFactsFromQueue(): Promise<void> {
    await consumeAwardFromQueue('mark_as_taken_medication_queue', AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeMarkAsMissedMedicationFactsFromQueue(): Promise<void> {
    await consumeAwardFromQueue('mark_as_missed_medication_queue', AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeAddBloodGlucoseFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_body_glucose_queue', AwardsFactsService.addOrUpdateMedicationFact);
}

export async function consumeUpdateBloodGlucoseFromQueue(): Promise<void> {
    await consumeAwardFromQueue('update_body_glucose_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddBloodOxygenSaturationFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_blood_oxygen_saturation_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdateBloodOxygenSaturationFromQueue(): Promise<void> {
    await consumeAwardFromQueue('update_blood_oxygen_saturation_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddBloodPressureFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_blood_pressure_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdateBloodPressureFromQueue(): Promise<void> {
    await consumeAwardFromQueue('update_blood_pressure_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddBodyTemperatureFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_body_temperature_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdateBodyTemperatureFromQueue(): Promise<void> {
    await consumeAwardFromQueue('update_body_temperature_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddBodyWeightFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_body_weight_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdateBodyWeightFromQueue(): Promise<void> {
    await consumeAwardFromQueue('update_body_weight_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddPulseFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_pulse_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeUpdatePulseFromQueue(): Promise<void> {
    await consumeAwardFromQueue('update_pulse_queue', AwardsFactsService.addOrUpdateVitalFact);
}

export async function consumeAddSleepFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_sleep_queue', AwardsFactsService.addOrUpdateMentalHealthResponseFact);
}

export async function consumeAddMedicationFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_medication_queue', AwardsFactsService.addOrUpdateMentalHealthResponseFact);
}

export async function consumeAddPhysicalActivityFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_physical_activity_queue', AwardsFactsService.addOrUpdatePhysicalActivityResponseFact);
}

export async function consumeUpdatePhysicalActivityFromQueue(): Promise<void> {
    await consumeAwardFromQueue('update_physical_activity_queue', AwardsFactsService.addOrUpdatePhysicalActivityResponseFact);
}

export async function consumeAddFoodConsumptionFromQueue(): Promise<void> {
    await consumeAwardFromQueue('add_food_consumption_queue', AwardsFactsService.addOrUpdateNutritionResponseFact);
}

export async function consumeUpdateFoodConsumptionFromQueue(): Promise<void> {
    await consumeAwardFromQueue('update_food_consumption_queue', AwardsFactsService.addOrUpdateNutritionResponseFact);
}

//EHR Vital

export async function consumeAddBloodGlucoseEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_blood_glucose_ehr_queue', async (messageContent) => {
        const eHRVitalService = new EHRVitalService();
        await eHRVitalService.addEHRBloodGlucoseForAppNames(messageContent);
    });
}

export async function consumeUpdateBloodGlucoseEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_blood_glucose_ehr_queue', async (messageContent) => {
        const eHRVitalService = new EHRVitalService();
        await eHRVitalService.addEHRBloodGlucoseForAppNames(messageContent);
    });
}

export async function consumeDeleteBloodGlucoseEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_blood_glucose_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.deleteRecord(messageContent);
    });
}

export async function consumeAddOxygenSaturationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_oxygen_saturation_ehr_queue', async (messageContent) => {
        const eHRVitalService = new EHRVitalService();
        await eHRVitalService.addEHRBloodOxygenSaturationForAppNames(messageContent);
    });
}

export async function consumeUpdateOxygenSaturationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_oxygen_saturation_ehr_queue', async (messageContent) => {
        const eHRVitalService = new EHRVitalService();
        await eHRVitalService.addEHRBloodOxygenSaturationForAppNames(messageContent);
    });
}

export async function consumeDeleteBloodOxygenSaturationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_blood_oxygen_saturation_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.deleteRecord(messageContent);
    });
}

export async function consumeAddBloodPressureEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_blood_pressure_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRBloodPressureForAppNames(messageContent);
    });
}

export async function consumeUpdateBloodPressureEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_blood_pressure_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRBloodPressureForAppNames(messageContent);
    });
}


export async function consumeDeleteBloodPressureEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_blood_pressure_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.deleteRecord(messageContent);
    });
}

export async function consumeAddBodyHeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_body_height_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRBodyHeightForAppNames(messageContent);
    });
}

export async function consumeUpdateBodyHeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_body_height_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRBodyHeightForAppNames(messageContent);
    });
}

export async function consumeDeleteBodyHeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_body_height_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.deleteRecord(messageContent);
    });
}

export async function consumeAddBodyWeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_body_weight_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRBodyWeightForAppNames(messageContent);
    });
}

export async function consumeUpdateBodyWeighttEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_body_weight_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRBodyWeightForAppNames(messageContent);
    });
}

export async function consumeDeleteBodyWeightEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_body_weight_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.deleteRecord(messageContent);
    });
}

export async function consumeAddBodyTempEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_body_temperature_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRBodyTemperatureForAppNames(messageContent);
    });
}

export async function consumeUpdateBodyTempEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_body_temperature_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRBodyTemperatureForAppNames(messageContent);
    });
}

export async function consumeDeleteBodyTemperatureEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_body_height_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.deleteRecord(messageContent);
    });
}


export async function consumeAddPulseEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_pulse_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRPulseForAppNames(messageContent);
    });
}

export async function consumeUpdatePulsetEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_pulse_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.addEHRPulseForAppNames(messageContent);
    });
}

export async function consumeDeletePulseControleEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_pulse_controle_ehr_queue', async (messageContent) => {
        const ehrVitalService = new EHRVitalService();
        ehrVitalService.deleteRecord(messageContent);
    });
}

export async function consumeAddLabRecordEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_lab_record_ehr_queue', async (messageContent) => {
        const ehrLabService = new EHRLabService();
        ehrLabService.addEHRLabRecordForAppNames(messageContent);
    });
}

export async function consumeUpdateLabRecordEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_lab_record_ehr_queue', async (messageContent) => {
        const ehrLabService = new EHRLabService();
        ehrLabService.addEHRLabRecordForAppNames(messageContent);
    });
}

export async function consumeDeleteLabRecordEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_lab_record_ehr_queue', async (messageContent) => {
        const eHRLabService = new EHRLabService();
        eHRLabService.deleteLabEHRRecord(messageContent);
    });
}

export async function consumeAddMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_medication_ehr_queue', async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeDeleteMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_medication_record_ehr_queue', async (messageContent) => {
        const eHRMedicationService = new EHRMedicationService();
        eHRMedicationService.deleteMedicationEHRRecords(messageContent);
    });
}

export async function consumeMarkListAsMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('ehr_mark_list_as_taken_medication_queue', async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeMarkListAsMissedMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('ehr_mark_list_as_missed_medication_queue', async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeMarkAsTakenMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('ehr_mark_as_taken_medication_queue', async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeMarkAsMissedMedicationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('ehr_mark_as_missed_medication_queue', async (messageContent) => {
        const ehrMedicationService = new EHRMedicationService();
        ehrMedicationService.addEHRMedicationConsumptionForAppNames(messageContent);
    });
}

export async function consumeAnswerQuestionEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('answer_question_ehr_queue', async (messageContent) => {
        const ehrAssessmentService = new EHRAssessmentService();
        ehrAssessmentService.addEHRRecordForAppNames(messageContent);
    });
}

export async function consumeAnswerQuestionListEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('answer_question_list_ehr_queue', async (messageContent) => {
        const ehrAssessmentService = new EHRAssessmentService();
        ehrAssessmentService.addEHRRecordForAppNames(messageContent);
    });
}

export async function consumeAddDailyAssessmentEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_daily_assessement_ehr_queue', async (messageContent) => {
        const ehrHowDoYouFeelService = new EHRHowDoYouFeelService();
        ehrHowDoYouFeelService.addEHRDailyAssessmentForAppNames(messageContent);
    });
}

export async function consumeEnrolAndCreateTaskEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('enrol_and_create_task_ehr_queue', async (messageContent) => {
        const ehrCareplanActivityService = new EHRCareplanActivityService();
        ehrCareplanActivityService.addCareplanActivitiesToEHR(messageContent.CareplanActivities, messageContent.PatientDetails);
    });
}

export async function consumeAddHowDoYouFeelEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_how_do_you_feel_ehr_queue', async (messageContent) => {
        const ehrHowDoYouFeelService = new EHRHowDoYouFeelService();
        ehrHowDoYouFeelService.addEHRHowDoYouFeelForAppNames(messageContent);
    });
}

export async function consumeUpdateHowDoYouFeelEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_how_do_you_feel_ehr_queue', async (messageContent) => {
        const ehrHowDoYouFeelService = new EHRHowDoYouFeelService();
        ehrHowDoYouFeelService.addEHRHowDoYouFeelForAppNames(messageContent);
    });
}

export async function consumeAddSleepEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_sleep_ehr_queue', async (messageContent) => {
        const ehrMentalWellBeingService = new EHRMentalWellBeingService();
        ehrMentalWellBeingService.addEHRSleepForAppNames(messageContent);
    });
}

export async function consumeAddMeditationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_meditation_ehr_queue', async (messageContent) => {
        const ehrMentalWellBeingService = new EHRMentalWellBeingService();
        ehrMentalWellBeingService.addEHRMeditationForAppNames(messageContent);
    });
}

export async function consumeUpdateMeditationEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_meditation_ehr_queue', async (messageContent) => {
        const ehrMentalWellBeingService = new EHRMentalWellBeingService();
        ehrMentalWellBeingService.addEHRMeditationForAppNames(messageContent);
    });
}

export async function consumeAddFoodConsumptionEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_food_consumption_ehr_queue', async (messageContent) => {
        const ehrNutritionService = new EHRNutritionService();
        ehrNutritionService.addEHRRecordNutritionForAppNames(messageContent);
    });
}

export async function consumeAddEmergencyContactEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_emergency_contact_ehr_queue', async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.addEHRRecordEmergencyContactForAppNames(messageContent);
    });
}

export async function consumeUpdateHealthProfileByPatientUserIdEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_health_profile_by_patientUserId_ehr_queue', async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.addEHRRecordHealthProfileForAppNames(messageContent);
    });
}

export async function consumeAddPatientEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_patient_ehr_queue', async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.addEHRRecordPatientForAppNames(messageContent);
    });
}

export async function consumeUpdatePatientEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_patient_ehr_queue', async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.addEHRRecordPatientForAppNames(messageContent);
    });
}

export async function consumeDeletePatientEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('delete_patient_ehr_queue', async (messageContent) => {
        const ehrPatientService = new EHRPatientService();
        ehrPatientService.deleteStaticEHRRecord(messageContent);
    });
}
////////////////////////////////////////////////
export async function consumeAddStandEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_stand_ehr_queue', async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordStandForAppNames(messageContent);
    });
}

export async function consumeUpdateStandEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_stand_ehr_queue', async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordStandForAppNames(messageContent);
    });
}

export async function consumeAddStepCountEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_step_count_ehr_queue', async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordStepCountForAppNames(messageContent);
    });
}

export async function consumeUpdateStepCountEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_step_count_ehr_queue', async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordStepCountForAppNames(messageContent);
    });
}

export async function consumeAddPhysicalActivityEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('add_physical_activity_ehr_queue', async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordPhysicalActivityForAppNames(messageContent);
    });
}

export async function consumeUpdatePhysicalActivityEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('update_physical_activity_ehr_queue', async (messageContent) => {
        const ehrPhysicalActivityService = new EHRPhysicalActivityService();
        ehrPhysicalActivityService.addEHRRecordPhysicalActivityForAppNames(messageContent);
    });
}

export async function consumeUserFinishTaskEHRFromQueue(): Promise<void> {
    await consumeEHRFromQueue('user_finish_task_ehr_queue', async (messageContent) => {
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