import mongoose from 'mongoose';
import os from 'os';
import process from 'process';
import { nodeMailerServices } from '../services/nodemailer/MailServices';

export class Connections {
  private readonly _SECOND: number = 5000;

  constructor() {}

  public readMonitorServer() {
    setInterval(async () => {
      const numberConectDb: number = mongoose.connections.length || 0;
      if (numberConectDb <= 0) return;
      const cpuCore = os.cpus().length;
      const memory = process.memoryUsage().rss;
      const maxConnect = cpuCore * 5;

      if (numberConectDb > maxConnect) {
        console.log(`Connect overload detected!!! Memory usage: ${memory / 1024 / 1024} MB`);
        await nodeMailerServices.sendOverLoadSystem(memory / 1024 / 1024, numberConectDb);
      }
    }, this._SECOND);
  }
}
