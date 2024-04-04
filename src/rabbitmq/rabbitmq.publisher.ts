import { uuid } from '../../src/domain.types/miscellaneous/system.types';
import { getRabbitMQConnection } from '../rabbitmq/rabbitmq.connection';
import * as amqp from 'amqplib';
import { EHRStaticRecordDomainModel } from '../../src.bg.worker/src.bg/modules/ehr.analytics/ehr.domain.models/ehr.analytics.domain.model';
import { AssessmentService } from '../../src/services/clinical/assessment/assessment.service';


async function publishAwardEventToQueue(queueName: string, message: any): Promise<void> {
    try {
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Assert the queue to make sure it exists, otherwise create it
        await channel.assertQueue(queueName, { durable: true });

        // Convert the RecordDate to a timestamp
        if (message.RecordDate instanceof Date) {
            message.RecordDate = message.RecordDate.getTime();
        }

        // Convert the message to a buffer
        const messageBuffer = Buffer.from(JSON.stringify(message));

        // Publish the message to the queue
        await channel.sendToQueue(queueName, messageBuffer, { persistent: true });

        console.log('Message published to RabbitMQ queue');

        // Close the channel
        await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

// export async function publishAwardEventToQueue(queueName: string, message: any): Promise<void> {
//     try {
//         const connection = getRabbitMQConnection();
//         const channel = await connection.createChannel();
//         await channel.assertQueue(queueName, { durable: true });
//         const messageBuffer = Buffer.from(JSON.stringify(message));
//         await channel.sendToQueue(queueName, messageBuffer, { persistent: true });
//         await channel.close();
//         await connection.close();
//     } catch (error) {
//         console.error(`Error publishing message to RabbitMQ queue ${queueName}:`, error);
//         throw error;
//     }
// }

export async function publishMarkListAsTakenMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('mark_list_as_taken_medication_queue', message);
}

export async function publishMarkListAsMissedMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('mark_list_as_missed_medication_queue', message);
}

export async function publishMarkAsTakenMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('mark_as_taken_medication_queue', message);
}

export async function publishMarkAsMissedMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('mark_as_missed_medication_queue', message);
}

export async function publishAddBodyGlucoseToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_body_glucose_queue', message);
}

export async function publishUpdateBodyGlucoseToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('update_body_glucose_queue', message);
}

export async function publishAddBloodOxygenSaturationToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_blood_oxygen_saturation_queue', message);
}

export async function publishUpdateBloodOxygenSaturationToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('update_blood_oxygen_saturation_queue', message);
}

export async function publishAddBloodPressureToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_blood_pressure_queue', message);
}

export async function publishUpdateBloodPressureToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('update_blood_pressure_queue', message);
}

export async function publishAddBodyTemperatureToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_body_temperature_queue', message);
}

export async function publishUpdateBodyTemperatureToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('update_body_temperature_queue', message);
}

export async function publishAddBodyWeightToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_body_weight_queue', message);
}

export async function publishUpdateBodyWeightToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('update_body_weight_queue', message);
}

export async function publishAddPulseToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_pulse_queue', message);
}

export async function publishUpdatePulseToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('update_pulse_queue', message);
}

export async function publishAddSleepToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_sleep_queue', message);
}

export async function publishAddMedicationToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_medication_queue', message);
}

export async function publishAddPhysicalActivityToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_physical_activity_queue', message);
}

export async function publishUpdatePhysicalActivityToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('update_physical_activity_queue', message);
}

export async function publishAddFoodConsumptionToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('add_food_consumption_queue', message);
}

export async function publishUpdateFoodConsumptionToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue('update_food_consumption_queue', message);
}

///////////////////////////////////////////////////
//types controlle route
//////////////////////////////////////////////////

// EHR Vital Service 
// Function to publish an EHR message to the specified queue

async function publishEHREventToQueue(queueName: string, message: any): Promise<void> {
    try {
        
        // Create a channel from the connection
        const connection = getRabbitMQConnection();
        const channel = await connection.createChannel();

        // Assert the queue to make sure it exists, otherwise create it
        await channel.assertQueue(queueName, { durable: true });

        // Convert the message to a buffer
        const messageBuffer = Buffer.from(JSON.stringify(message));

        // Publish the message to the queue
        await channel.sendToQueue(queueName, messageBuffer, { persistent: true });

        console.log(`EHR Message published to RabbitMQ queue: ${queueName}`);

        // Close the channel
        //await channel.close();
    } catch (error) {
        console.error(`Error publishing EHR message to RabbitMQ queue ${queueName}:`, error);
        throw error;
    }
}

// Blood Blood Glucose EHR messages
export async function publishAddBloodGlucoseEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_blood_glucose_ehr_queue', message);
}

export async function publishUpdateBloodGlucoseEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_blood_glucose_ehr_queue', message);
}

export async function publishDeleteBloodGlucoseEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_blood_glucose_ehr_queue', message);
}

// Blood Saturation EHR messages
export async function publishAddBloodSaturationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_blood_saturation_ehr_queue', message);
    console.log('ehr to add blood saturation worked')
}

export async function publishUpdateBloodSaturationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_blood_saturation_ehr_queue', message);
}

export async function publishDeleteBloodSaturationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_blood_saturation_ehr_queue', message);
}

// Blood Pressure EHR messages
export async function publishAddBloodPressureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_blood_pressure_ehr_queue', message);
}

export async function publishUpdateBloodPressureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_blood_pressure_ehr_queue', message);
}

export async function publishDeleteBloodPressureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_blood_pressure_ehr_queue', message);
}
// Body Height EHR messages
export async function publishAddBodyHeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_body_height_ehr_queue', message);
}

export async function publishUpdateBodyHeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_body_height_ehr_queue', message);
}

export async function publishDeleteBodyHeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_body_height_ehr_queue', message);
}

// Body Weight EHR messages
export async function publishAddBodyWeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_body_weight_ehr_queue', message);
}

export async function publishUpdateBodyWeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_body_weight_ehr_queue', message);
}

export async function publishDeleteBodyWeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_body_weight_ehr_queue', message);
}

// Body Temperature EHR messages
export async function publishBodyTemperatureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_body_temperature_ehr_queue', message);
}

export async function publishUpdateBodyTemperatureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_body_temperature_ehr_queue', message);
}

export async function publishDeleteBodyTemperatureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_body_temperature_ehr_queue', message);
}

// Pulse Control EHR messages
export async function publishPulseControlEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_pulse_ehr_queue', message);
}

export async function publishUpdatePulseControlEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_pulse_ehr_queue', message);
}

export async function publishDeletePulseControlEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_pulse_control_ehr_queue', message);
}

// Lab Record EHR messages
export async function publishLaddRecordEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_lab_record_ehr_queue', message);
}

export async function publishUpdateLabRecordEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_lab_record_ehr_queue', message);
}

export async function publishDeleteLabRecordEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_lab_record_ehr_queue', message);
}

// Medication EHR messages
export async function publishAddMedicationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_medication_ehr_queue', message);
}

export async function publishDeleteMedicationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_medication_ehr_queue', message);
}

// Daily Assessment EHR messages
export async function publishAddDailyAssessmentEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_daily_assessment_ehr_queue', message);
}

// Answer Question List EHR messages

export async function publishAnswerQuestionEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('answer_question_ehr_queue', message);
}

export async function publishAnswerQuestionListEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('answer_question_list_ehr_queue', message);
}

// care plan service

export async function publishEnrollAndCreateTaskEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('enrol_and_create_task_ehr_queue', message);
}

// how do you feel service

export async function publishAddHowDoYouFeelEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_how_do_you_feel_ehr_queue', message);
}

export async function publishUpdateHowDoYouFeelEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_how_do_you_feel_ehr_queue', message);
}

// medication controller

export async function publishEHRMarkListAsTakenMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishEHREventToQueue('ehr_mark_list_as_taken_medication_queue', message);
}

export async function publishEHRMarkListAsMissedMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishEHREventToQueue('ehr_mark_list_as_missed_medication_queue', message);
}

export async function publishEHRMarkAsTakenMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishEHREventToQueue('ehr_mark_as_taken_medication_queue', message);
}

export async function publishEHRMarkAsMissedMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishEHREventToQueue('ehr_mark_as_missed_medication_queue', message);
}

// sleep controller

export async function publishAddSleeptEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_sleep_ehr_queue', message);
}

// meditation controller

export async function publishAddMeditationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_meditation_ehr_queue', message);
}

export async function publishUpdateMeditationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_meditation_ehr_queue', message);
}

// food consumption

export async function publishAddFoodConsumptionEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_food_consumption_ehr_queue', message);
}

// emergency contat controller

export async function publishAddEmergencyContactEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_emergency_contact_ehr_queue', message);
}

// health profile controller

export async function publishUpdateHealthProfileByPatientUserIdEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_health_profile_by_patientUserId_ehr_queue', message);
}

// patient controller

export async function publishAddPatientEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_patient_ehr_queue', message);
}

export async function publishUpdatePatientEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_patient_ehr_queue', message);
}

export async function publishDeletePatientEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('delete_patient_ehr_queue', message);
}

// stand controller

export async function publishAddStandEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_stand_ehr_queue', message);
}

export async function publishUpdateStandEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_stand_ehr_queue', message);
}

// strp count controller 

export async function publishAddStepCountEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_step_count_ehr_queue', message);
}

export async function publishUpdateStepCountEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_step_count_ehr_queue', message);
}

// physical activity controller

export async function publishAddPhysicalActivityEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('add_physical_activity_ehr_queue', message);
}

export async function publishUpdatePhysicalActivityEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('update_physical_activity_ehr_queue', message);
}

export async function publishUserFinishTaskEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue('user_finish_task_ehr_queue', message);
}