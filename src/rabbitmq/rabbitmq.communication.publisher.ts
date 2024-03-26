// import { getRabbitMQConnection } from '../rabbitmq/rabbitmq.connection';
// import { Channel } from "amqplib";
// import config from "./config";
// import { randomUUID } from "crypto";
// import EventEmitter from "events";

// // export default class Producer {
// //     constructor(
// //         private channel: Channel,
// //         private replyQueueName: string,
// //         private eventEmitter: EventEmitter
// //     ) { }

// //     async produceSensBPMessagesToQueue(data: any) {
// //         const uuid = randomUUID();
// //         console.log("the corr id is ", uuid);
// //         this.channel.sendToQueue(
// //             config.rabbitMQ.queues.rpcQueue,
// //             Buffer.from(JSON.stringify(data)),
// //             {
// //                 replyTo: this.replyQueueName,
// //                 correlationId: uuid,
// //                 expiration: 10,
// //                 headers: {
// //                     function: data.operation,
// //                 },
// //             }
// //         );

// //         return new Promise((resolve, reject) => {
// //             this.eventEmitter.once(uuid, async (data) => {
// //                 const reply = JSON.parse(data.content.toString());
// //                 resolve(reply);
// //             });
// //         });
// //     }
// // }

// export async function produceBPMessagesToQueue(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_bp_message_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }
// //statistic controlle
// export async function produceMessagesForReportUpdateToQueue(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_message_for_report_update_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }
// //aha
// export async function produceSechudleHsSurveyToQueue(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_sechudle_survey_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }
// //community network service
// export async function produceReminderOnNoActionToDonationToQueue(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_reminder_action_donation_request_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

// export async function produceReminderOnNoActionToFifthDayToQueue(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_reminder_action_donation_fifth_day_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

// //care plan service
// export async function produceSechudleDailyCarePlanToQueue(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_sechudle_daily_careplan_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

// //user service
// export async function produceGenerateOtpToQueue(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_generate_otp_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

// // reminder sender service


// // notification service 

// //ahr actions 

// export async function publishNotificationCarePlanRegistration(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_care_plan_registration_reminder_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

// export async function publishSendNotificationToDevice(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_notification_device_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

// export async function publishSendStrokeSurveyNotification(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_stroke_survey_notification_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

// // blood pressure

// export async function publishBPNotification(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_blood_pressure_notification_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

// // medication consumption service

// export async function publishMedicationReminderNotification(message: any): Promise<boolean> {
//     try {
//         const uuid = randomUUID();
//         const connection = getRabbitMQConnection();

//         // Create a channel from the connection
//         const channel = await connection.createChannel();

//         // Specify the queue name
//         const queueName = 'send_medication_reminder_queue';
//         await channel.assertQueue(queueName, { durable: true });

//         this.channel.sendToQueue(
//             config.rabbitMQ.queues.rpcQueue,
//             Buffer.from(JSON.stringify(message)),
//             {
//                 replyTo: this.queueName,
//                 correlationId: uuid,
//                 expiration: 10,
//                 headers: {
//                     function: message.operation,
//                 },
//             }
//         );
//         console.log('Message published to RabbitMQ queue for communication');
//         return new Promise((resolve, reject) => {
//             this.eventEmitter.once(uuid, async (data) => {
//                 const reply = JSON.parse(data.content.toString());
//                 resolve(reply);
//             });
//         });

//         // Close the channel
//         // await channel.close();
//     } catch (error) {
//         console.error('Error publishing message to RabbitMQ:', error);
//         throw error;
//     }
// }

