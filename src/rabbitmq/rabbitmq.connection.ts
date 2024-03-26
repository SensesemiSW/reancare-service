import * as amqp from 'amqplib';
import { rabbitmqConfig } from './config';
// import { publishMedicationFactToQueue } from './rabbitmq.publisher';
let connection: amqp.Connection;

// Function to initialize RabbitMQ connection
export async function initializeRabbitMQ() {
    try {
        // connection to RabbitMQ
        connection = await amqp.connect(rabbitmqConfig);
        // log the connection
        console.log('Connected to RabbitMQ');
        // await publishMedicationFactToQueue()
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

// Function to get RabbitMQ connection
export function getRabbitMQConnection() {
    if (!connection) {
        throw new Error('RabbitMQ connection not initialized');
    }
    return connection;
}