const amqplib = require('amqplib');

const receiveDataRabitMQ = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const data = 'test sender';
    await channel.assertExchange(data, 'fanout', { durable: false });
    const { queue } = await channel.assertQueue('', { exclusive: true });
    console.log(queue);

    await channel.bindQueue(queue, data, '');

    await channel.consume(queue, (msg) => {
      console.log(msg.content.toString());
    });
  } catch (err) {
    console.error(err);
  }
};

receiveDataRabitMQ();
