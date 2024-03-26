// import { Channel, ConsumeMessage } from "amqplib";
// import EventEmitter from "events";
// import { getRabbitMQConnection } from '../rabbitmq/rabbitmq.connection';


// export default class Consumer {
//     constructor(
//         private channel: Channel,
//         private replyQueueName: string,
//         private eventEmitter: EventEmitter
//     ) { }

//     async consumeMessages() {
//         console.log("Ready to consume messages...");

//         this.channel.consume(
//             this.replyQueueName,
//             (message: ConsumeMessage) => {
//                 console.log("the reply is..", JSON.parse(message.content.toString()));
//                 this.eventEmitter.emit(
//                     message.properties.correlationId.toString(),
//                     message
//                 );
//             },
//             {
//                 noAck: true,
//             }
//         );
//     }
// }

// // export async function consumeMarkListAsTakenMedicationFactsFromQueue(): Promise<void> {
// //     try {
// //         // Create a channel from the connection
// //         const connection = getRabbitMQConnection();
// //         const channel = await connection.createChannel();

// //         // Specify the queue name
// //         const queueName = 'mark_list_as_taken_medication_queue'; // Make sure it matches your queue name

// //         await channel.assertQueue(queueName, { durable: true });         // Assert the queue to make sure it exists, otherwise create it

// //         // Set up the message consumer
// //         channel.consume(queueName, async (message) => {
// //             if (message !== null) {
// //                 try {
// //                     // Parse the message
// //                     const messageContent = JSON.parse(message.content.toString());

// //                     // Convert RecordDate back to a Date object
// //                     if (typeof messageContent.RecordDate === 'number') {
// //                         messageContent.RecordDate = new Date(messageContent.RecordDate);
// //                     }
// //                     // Process the message
// //                     await AwardsFactsService.addOrUpdateMedicationFact(messageContent);

// //                     // Acknowledge the message to remove it from the queue
// //                     channel.ack(message);
// //                 } catch (error) {
// //                     console.error('Error processing message from RabbitMQ:', error);
// //                     // Reject and requeue the message
// //                     channel.nack(message);
// //                 }
// //             }
// //         });
// //     } catch (error) {
// //         console.error('Error consuming messages from RabbitMQ:', error);
// //         throw error;
// //     }
// // }

// async function consumeMessages() {
//     console.log("Ready to consume messages...");
//     // Create a channel from the connection
//     const connection = getRabbitMQConnection();
//     const channel = await connection.createChannel();

//     const queueName = 'send_bp_message_queue'; // Make sure it matches your queue name
//     // Specify the queue name    
//     await channel.assertQueue(queueName, { durable: true });

//     channel.consume(
//         queueName,
//         function (message) {
//             console.log("the reply is..", JSON.parse(message.content.toString()));
//             eventEmitter.emit(
//                 message.properties.correlationId.toString(),
//                 message
//             );
//         },
//         {
//             noAck: true,
//         }
//     );
// }