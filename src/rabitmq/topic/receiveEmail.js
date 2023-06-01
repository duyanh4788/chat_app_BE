const amqplib = require('amqplib');

const receiveEmail = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost'); // create connect
    const channel = await connection.createChannel(); // create channel
    const data = 'send email';
    await channel.assertExchange(data, 'topic', { durable: false }); // create exchange
    const { queue } = await channel.assertQueue('', { exclusive: true }); // create binding

    const argv = process.argv.slice(2);
    if (!argv.length) {
      process.exit(0);
    }

    argv.forEach(async (key) => {
      await channel.bindQueue(queue, data, key);
    });
    await channel.consume(queue, (msg) => {
      console.log(`routing key ${msg.fields.routingKey}: msg:${msg.content.toString()}`);
    });
  } catch (err) {
    console.error(err);
  }
};

receiveEmail();
