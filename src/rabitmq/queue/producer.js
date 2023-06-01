const amqplib = require('amqplib');

const connectRabbitMq = async (msg) => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    [...Array(10)].map(async (_, idx) => {
      return await sendMq(channel, `demo${idx + 1}`, `hello ${idx}`);
    });
  } catch (ex) {
    console.error(ex);
  }
};

const sendMq = async (channel, nameQueue, msg) => {
  await channel.assertQueue(nameQueue, { durable: true }); // duralbe: save queue to harddisk or memcache
  channel.sendToQueue(nameQueue, Buffer.from(msg), {
    expiration: '10000',
    persistent: true // get to memcache or harddisk
  });
};

// const msg = process.argv.slice(2).join(' ') || 'TEST';
connectRabbitMq();
