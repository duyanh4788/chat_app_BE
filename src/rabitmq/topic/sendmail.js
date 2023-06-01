const amqplib = require('amqplib');

const sendEmail = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const data = 'send email';
    await channel.assertExchange(data, 'topic', { durable: false });

    const argv = process.argv.slice(2);
    const msg = argv[1] || 'demo topic';
    const topic = argv[0];

    channel.publish(data, topic, Buffer.from(msg));
  } catch (err) {
    console.error(err);
  }
};

sendEmail();
