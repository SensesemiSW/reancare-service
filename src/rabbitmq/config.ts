// RabbitMQ connection configuration
export const rabbitmqConfig = {
  protocol: 'amqp',
  hostname: 'localhost', // RabbitMQ server hostname
  port: 5672, // Default RabbitMQ port
  username: 'guest', // RabbitMQ username
  password: 'guest', // RabbitMQ password
};
export default {
  rabbitMQ: {
    url: "amqp://localhost",
    queues: {
      rpcQueue: "send_bp_message_queue",
    },
  },
};