import { Logger } from '../../src/common/logger';
import { getRabbitMQConnection } from '../rabbitmq/rabbitmq.connection';
import * as dotenv from 'dotenv';
dotenv.config();


export async function publishAwardEventToQueue(queueName: string, message: any): Promise<void> {
    try {
        const connection = getRabbitMQConnection();
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        // Convert the RecordDate to a timestamp
        if (message.RecordDate instanceof Date) {
            message.RecordDate = message.RecordDate.getTime();
        }
        const messageBuffer = Buffer.from(JSON.stringify(message));

        // Publish the message to the queue
        await channel.sendToQueue(queueName, messageBuffer, { persistent: true });

        Logger.instance().log('Award Message published to RabbitMQ queue');

        // Close the channel
        await channel.close();
    } catch (error) {
        Logger.instance().error(error, 500, `Error publishing Award message to RabbitMQ queue ${queueName}:`);
        throw error;
    }
}

// Functions to publish events to specific queues
export async function publishAddBloodOxygenSaturationToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_BLOOD_OXYGEN_SATURATION_QUEUE, message);
}

export async function publishUpdateBloodOxygenSaturationToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.UPDATE_BLOOD_OXYGEN_SATURATION_QUEUE, message);
}

export async function publishAddBodyGlucoseToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_BODY_GLUCOSE_QUEUE, message);
}

export async function publishUpdateBodyGlucoseToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.UPDATE_BODY_GLUCOSE_QUEUE, message);
}

export async function publishAddBloodPressureToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_BLOOD_PRESSURE_QUEUE, message);
}

export async function publishUpdateBloodPressureToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.UPDATE_BLOOD_PRESSURE_QUEUE, message);
}

export async function publishAddBodyTemperatureToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_BODY_TEMPERATURE_QUEUE, message);
}

export async function publishUpdateBodyTemperatureToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.UPDATE_BODY_TEMPERATURE_QUEUE, message);
}

export async function publishAddBodyWeightToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_BODY_WEIGHT_QUEUE, message);
}

export async function publishUpdateBodyWeightToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.UPDATE_BODY_WEIGHT_QUEUE, message);
}

export async function publishAddPulseToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_PULSE_QUEUE, message);
}

export async function publishUpdatePulseToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.UPDATE_PULSE_QUEUE, message);
}

export async function publishAddSleepToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_SLEEP_QUEUE, message);
}

export async function publishAddMedicationToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_MEDICATION_QUEUE, message);
}

export async function publishAddPhysicalActivityToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_PHYSICAL_ACTIVITY_QUEUE, message);
}

export async function publishUpdatePhysicalActivityToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.UPDATE_PHYSICAL_ACTIVITY_QUEUE, message);
}

export async function publishAddFoodConsumptionToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.ADD_FOOD_CONSUMPTION_QUEUE, message);
}

export async function publishUpdateFoodConsumptionToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.UPDATE_FOOD_CONSUMPTION_QUEUE, message);
}

export async function publishMarkListAsTakenMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.MARK_LIST_AS_TAKEN_MEDICATION_QUEUE, message);
}

export async function publishMarkListAsMissedMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.MARK_LIST_AS_MISSED_MEDICATION_QUEUE, message);
}

export async function publishMarkAsTakenMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.MARK_AS_TAKEN_MEDICATION_QUEUE, message);
}

export async function publishMarkAsMissedMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishAwardEventToQueue(process.env.MARK_AS_MISSED_MEDICATION_QUEUE, message);
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


        await channel.assertQueue(queueName, { durable: true });

        // Convert the message to a buffer
        const messageBuffer = Buffer.from(JSON.stringify(message));

        // Publish the message to the queue
        await channel.sendToQueue(queueName, messageBuffer, { persistent: true });

        console.log(`EHR Message published to RabbitMQ queue: ${queueName}`);

        // Close the channel
        //await channel.close();
    } catch (error) {
        Logger.instance().error(error, 500, `Error publishing EHR message to RabbitMQ queue ${queueName}:`);
        throw error;
    }
}

// Blood Blood Glucose EHR messages
export async function publishAddBloodGlucoseEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_BLOOD_GLUCOSE_EHR_QUEUE, message);
}

export async function publishUpdateBloodGlucoseEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_BLOOD_GLUCOSE_EHR_QUEUE, message);
}

export async function publishDeleteBloodGlucoseEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_BLOOD_GLUCOSE_EHR_QUEUE, message);
}

// Blood Saturation EHR messages
export async function publishAddBloodSaturationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_BLOOD_SATURATION_EHR_QUEUE, message);
}

export async function publishUpdateBloodSaturationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_BLOOD_SATURATION_EHR_QUEUE, message);
}

export async function publishDeleteBloodSaturationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_BLOOD_SATURATION_EHR_QUEUE, message);
}

// Blood Pressure EHR messages
export async function publishAddBloodPressureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_BLOOD_PRESSURE_EHR_QUEUE, message);
}

export async function publishUpdateBloodPressureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_BLOOD_PRESSURE_EHR_QUEUE, message);
}

export async function publishDeleteBloodPressureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_BLOOD_PRESSURE_EHR_QUEUE, message);
}

// Body Height EHR messages
export async function publishAddBodyHeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_BODY_HEIGHT_EHR_QUEUE, message);
}

export async function publishUpdateBodyHeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_BODY_HEIGHT_EHR_QUEUE, message);
}

export async function publishDeleteBodyHeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_BODY_HEIGHT_EHR_QUEUE, message);
}

// Body Weight EHR messages
export async function publishAddBodyWeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_BODY_WEIGHT_EHR_QUEUE, message);
}

export async function publishUpdateBodyWeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_BODY_WEIGHT_EHR_QUEUE, message);
}

export async function publishDeleteBodyWeightEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_BODY_WEIGHT_EHR_QUEUE, message);
}

// Body Temperature EHR messages
export async function publishBodyTemperatureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_BODY_TEMPERATURE_EHR_QUEUE, message);
}

export async function publishUpdateBodyTemperatureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_BODY_TEMPERATURE_EHR_QUEUE, message);
}

export async function publishDeleteBodyTemperatureEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_BODY_TEMPERATURE_EHR_QUEUE, message);
}

// Pulse Control EHR messages
export async function publishPulseControlEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_PULSE_EHR_QUEUE, message);
}

export async function publishUpdatePulseControlEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_PULSE_EHR_QUEUE, message);
}

export async function publishDeletePulseControlEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_PULSE_CONTROL_EHR_QUEUE, message);
}

// Lab Record EHR messages
export async function publishLaddRecordEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_LAB_RECORD_EHR_QUEUE, message);
}

export async function publishUpdateLabRecordEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_LAB_RECORD_EHR_QUEUE, message);
}

export async function publishDeleteLabRecordEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_LAB_RECORD_EHR_QUEUE, message);
}

// Medication EHR messages
export async function publishAddMedicationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_MEDICATION_EHR_QUEUE, message);
}

export async function publishDeleteMedicationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_MEDICATION_EHR_QUEUE, message);
}

// Daily Assessment EHR messages
export async function publishAddDailyAssessmentEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_DAILY_ASSESSMENT_EHR_QUEUE, message);
}

// Answer Question List EHR messages

export async function publishAnswerQuestionEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ANSWER_QUESTION_EHR_QUEUE, message);
}

export async function publishAnswerQuestionListEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ANSWER_QUESTION_LIST_EHR_QUEUE, message);
}

// care plan service

export async function publishEnrollAndCreateTaskEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ENROL_AND_CREATE_TASK_EHR_QUEUE, message);
}

// how do you feel service

export async function publishAddHowDoYouFeelEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_HOW_DO_YOU_FEEL_EHR_QUEUE, message);
}

export async function publishUpdateHowDoYouFeelEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_HOW_DO_YOU_FEEL_EHR_QUEUE, message);
}

// medication controller

export async function publishEHRMarkListAsTakenMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishEHREventToQueue(process.env.EHR_MARK_LIST_AS_TAKEN_MEDICATION_QUEUE, message);
}

export async function publishEHRMarkListAsMissedMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishEHREventToQueue(process.env.EHR_MARK_LIST_AS_MISSED_MEDICATION_QUEUE, message);
}

export async function publishEHRMarkAsTakenMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishEHREventToQueue(process.env.EHR_MARK_AS_TAKEN_MEDICATION_QUEUE, message);
}

export async function publishEHRMarkAsMissedMedicationFactToQueue(
    message: any
): Promise<void> {
    await publishEHREventToQueue(process.env.EHR_MARK_AS_MISSED_MEDICATION_QUEUE, message);
}

// sleep controller

export async function publishAddSleeptEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_SLEEP_EHR_QUEUE, message);
}

// meditation controller

export async function publishAddMeditationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_MEDITATION_EHR_QUEUE, message);
}

export async function publishUpdateMeditationEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_MEDITATION_EHR_QUEUE, message);
}

// food consumption

export async function publishAddFoodConsumptionEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_FOOD_CONSUMPTION_EHR_QUEUE, message);
}

// emergency contat controller

export async function publishAddEmergencyContactEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_EMERGENCY_CONTACT_EHR_QUEUE, message);
}

// health profile controller

export async function publishUpdateHealthProfileByPatientUserIdEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_HEALTH_PROFILE_BY_PATIENT_USERID_EHR_QUEUE, message);
}

// patient controller

export async function publishAddPatientEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_PATIENT_EHR_QUEUE, message);
}

export async function publishUpdatePatientEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_PATIENT_EHR_QUEUE, message);
}

export async function publishDeletePatientEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.DELETE_PATIENT_EHR_QUEUE, message);
}

// stand controller

export async function publishAddStandEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_STAND_EHR_QUEUE, message);
}

export async function publishUpdateStandEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_STAND_EHR_QUEUE, message);
}

// strp count controller 

export async function publishAddStepCountEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_STEP_COUNT_EHR_QUEUE, message);
}

export async function publishUpdateStepCountEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_STEP_COUNT_EHR_QUEUE, message);
}

// physical activity controller

export async function publishAddPhysicalActivityEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.ADD_PHYSICAL_ACTIVITY_EHR_QUEUE, message);
}

export async function publishUpdatePhysicalActivityEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.UPDATE_PHYSICAL_ACTIVITY_EHR_QUEUE, message);
}

export async function publishUserFinishTaskEHRToQueue(message: any): Promise<void> {
    await publishEHREventToQueue(process.env.USER_FINISH_TASK_EHR_QUEUE, message);
}
