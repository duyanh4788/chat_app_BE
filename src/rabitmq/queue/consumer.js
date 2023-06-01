const amqplib = require('amqplib');

const receiveRabbitMq = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    [...Array(10)].map(async (_, idx) => {
      return await reciveMq(channel, `demo${idx + 1}`);
    });
  } catch (err) {
    console.error(err);
  }
};

const reciveMq = async (channel, nameQueue) => {
  await channel.assertQueue(nameQueue, { durable: true });
  await channel.consume(
    nameQueue,
    (msg) => {
      console.log(msg.content.toString());
    },
    { noAck: true }
  );
};
receiveRabbitMq();
