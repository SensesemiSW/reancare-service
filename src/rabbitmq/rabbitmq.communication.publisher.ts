import { getRabbitMQConnection } from '../rabbitmq/rabbitmq.connection';
import { Channel } from "amqplib";
import config from "./config";
import { randomUUID } from "crypto";
import EventEmitter from "events";

// export async function produceBPMessagesToQueue(message: any): Promise<void> {
//     try {
//         const corrId = randomUUID();
//         const connection = getRabbitMQConnection();
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queue = 'send_bp_message_queue';
//         await channel.assertQueue('', { exclusive: true }).then(q=>{
//             channel.consume(q.queue, function (msg) {
//                 if (msg.properties.correlationId == corrId) {
//                     console.log('Response:', msg.content.toString());
//                 }
//             }, { noAck: true });

//             channel.sendToQueue(queue,
//                 Buffer.from(message.toString()),
//                 {
//                     correlationId: corrId,
//                     replyTo: q.queue
//                 }
//             );
//             console.log('message published to queue')
//         });
//         // console.log('Message published to RabbitMQ queue for communication');
//         // return new Promise((resolve, reject) => {
//         //     this.eventEmitter.once(uuid, async (data) => {
//         //         const reply = JSON.parse(data.content.toString());
//         //         resolve(reply);
//         //     });
//         // });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

async function produceBPMessagesToQueue(message: any): Promise<void> {
    const corrId = randomUUID();
    const connection = getRabbitMQConnection();
    const channel = await connection.createChannel();

    // Specify the queue name
    const queue = 'send_bp_message_queue';

    try {
        return new Promise((resolve, reject) => {
            channel.assertQueue('', { exclusive: true }).then(q => {
                channel.consume(q.queue, function (msg) {
                    if (msg.properties.correlationId == corrId) {
                        resolve(msg.content.toString());
                    }
                }, { noAck: true });

                channel.sendToQueue(queue,
                    Buffer.from(message.toString()),
                    {
                        correlationId: corrId,
                        replyTo: q.queue
                    }
                );
                console.log('message published to queue');
            }).catch(reject);
        });
    } catch (error) {
        console.error(error);
    }
}

//statistic controlle
export async function produceMessagesForReportUpdateToQueue(message: any): Promise<boolean> {
    try {
        const corrId = randomUUID();
        const connection = getRabbitMQConnection();
        const channel = await connection.createChannel();

        // Specify the queue name
        const queue = 'send_message_for_report_update_queue';
        return new Promise((resolve, reject) => {
            channel.assertQueue('', { exclusive: true }).then(q => {
                channel.consume(q.queue, function (msg) {
                    if (msg.properties.correlationId == corrId) {
                        resolve(msg.content.toString());
                    }
                }, { noAck: true });

                channel.sendToQueue(queue,
                    Buffer.from(message.toString()),
                    {
                        correlationId: corrId,
                        replyTo: q.queue
                    }
                );
                console.log('message published to queue');
            }).catch(reject);
        });
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}
//aha
export async function produceSechudleHsSurveyToQueue(message: any): Promise<boolean> {
    try {
        const corrId = randomUUID();
        const connection = getRabbitMQConnection();
        const channel = await connection.createChannel();

        // Specify the queue name
        const queue = 'send_sechudle_survey_queue';
        return new Promise((resolve, reject) => {
            channel.assertQueue('', { exclusive: true }).then(q => {
                channel.consume(q.queue, function (msg) {
                    if (msg.properties.correlationId == corrId) {
                        resolve(msg.content.toString());
                    }
                }, { noAck: true });

                channel.sendToQueue(queue,
                    Buffer.from(message.toString()),
                    {
                        correlationId: corrId,
                        replyTo: q.queue
                    }
                );
                console.log('message published to queue');
            }).catch(reject);
        });
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}
//community network service
export async function produceReminderOnNoActionToDonationToQueue(message: any): Promise<boolean> {
    try {
        const uuid = randomUUID();
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Specify the queue name
        const queueName = 'send_reminder_action_donation_request_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Message published to RabbitMQ queue for communication');
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });

        // Close the channel
        // await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

export async function produceReminderOnNoActionToFifthDayToQueue(message: any): Promise<boolean> {
    try {
        const uuid = randomUUID();
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Specify the queue name
        const queueName = 'send_reminder_action_donation_fifth_day_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Message published to RabbitMQ queue for communication');
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });

        // Close the channel
        // await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

//care plan service
export async function produceSechudleDailyCarePlanToQueue(message: any): Promise<boolean> {
    try {
        const uuid = randomUUID();
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Specify the queue name
        const queueName = 'send_sechudle_daily_careplan_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Message published to RabbitMQ queue for communication');
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });

        // Close the channel
        // await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

//user service
export async function produceGenerateOtpToQueue(message: any): Promise<boolean> {
    try {
        const uuid = randomUUID();
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Specify the queue name
        const queueName = 'send_generate_otp_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Message published to RabbitMQ queue for communication');
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });

        // Close the channel
        // await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

// reminder sender service


// notification service 

//ahr actions 

export async function publishNotificationCarePlanRegistration(message: any): Promise<boolean> {
    try {
        const uuid = randomUUID();
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Specify the queue name
        const queueName = 'send_care_plan_registration_reminder_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Message published to RabbitMQ queue for communication');
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });

        // Close the channel
        // await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

export async function publishSendNotificationToDevice(message: any): Promise<boolean> {
    try {
        const uuid = randomUUID();
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Specify the queue name
        const queueName = 'send_notification_device_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Message published to RabbitMQ queue for communication');
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });

        // Close the channel
        // await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

export async function publishSendStrokeSurveyNotification(message: any): Promise<boolean> {
    try {
        const uuid = randomUUID();
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Specify the queue name
        const queueName = 'send_stroke_survey_notification_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Message published to RabbitMQ queue for communication');
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });

        // Close the channel
        // await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

// blood pressure

export async function publishBPNotification(message: any): Promise<boolean> {
    try {
        const uuid = randomUUID();
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Specify the queue name
        const queueName = 'send_blood_pressure_notification_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Message published to RabbitMQ queue for communication');
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });

        // Close the channel
        // await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}

// medication consumption service

export async function publishMedicationReminderNotification(message: any): Promise<boolean> {
    try {
        const uuid = randomUUID();
        const connection = getRabbitMQConnection();

        // Create a channel from the connection
        const channel = await connection.createChannel();

        // Specify the queue name
        const queueName = 'send_medication_reminder_queue';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Message published to RabbitMQ queue for communication');
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                const reply = JSON.parse(data.content.toString());
                resolve(reply);
            });
        });

        // Close the channel
        // await channel.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}


// #### Email Service ####

// export async function produceSendCreateTenantReqToQueue(message: any): Promise<boolean> {
//     try {
//         const corrId = randomUUID();
//         const connection = getRabbitMQConnection();
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queue = 'send_add_tenant_req_to_queue';
//         return new Promise((resolve, reject) => {
//             channel.assertQueue('', { exclusive: true }).then(q => {
//                 channel.consume(q.queue, function (msg) {
//                     if (msg.properties.correlationId == corrId) {
//                         resolve(msg.content.toString());
//                     }
//                 }, { noAck: true });

//                 channel.sendToQueue(queue,
//                     Buffer.from(message.toString()),
//                     {
//                         correlationId: corrId,
//                         replyTo: q.queue
//                     }
//                 );
//                 console.log('message published to queue');
//             }).catch(reject);
//         });
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

export async function produceSendCreateTenantReqToQueue(message: any): Promise<boolean> {
    try {
        const corrId = randomUUID();
        const connection = getRabbitMQConnection();
        const channel = await connection.createChannel();
        const queue = 'send_add_tenant_req_to_queue';

        const q = await channel.assertQueue('', { exclusive: true });
        await channel.consume(q.queue, (msg) => {
            if (msg.properties.correlationId == corrId) {
                console.log('Received message:', msg);
            }
        }, { noAck: true });

        await channel.sendToQueue(queue, Buffer.from(message), {
            correlationId: corrId,
            replyTo: q.queue
        });
        console.log('Message published to queue'+message);
        return true;
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
        throw error;
    }
}