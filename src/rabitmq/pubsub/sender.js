const amqplib = require('amqplib');

const postDataRabitMQ = async (msg) => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const data = 'test sender';
    await channel.assertExchange(data, 'fanout', { durable: false });
    channel.publish(data, '', Buffer.from(msg));
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 2000);
  } catch (err) {
    console.error(err);
  }
};

const msg = process.argv.slice(2).join(' ') || 'TEST';
postDataRabitMQ(msg);
