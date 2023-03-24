import mongoose from 'mongoose';
import os from 'os';
import process from 'process';
import { NodeMailerServices } from '../services/nodemailer/MailServices';

export class Connections {
    private readonly _SECOND: number = 5000;
    private mailServices: NodeMailerServices = new NodeMailerServices()

    constructor() { }

    public readMonitorServer() {
        setInterval(() => {
            const numberConectDb: number = mongoose.connections.length || 0;
            if (numberConectDb <= 0) return;
            const cpuCore = os.cpus().length;
            const memory = process.memoryUsage().rss;
            const maxConnect = cpuCore * 5;

            console.log(`Memory usage: ${memory / 1024 / 1024} MB`);

            if (numberConectDb > maxConnect) {
                console.log(`Connect overload detected!`);
                this.mailServices.sendOverLoadSystem(memory / 1024 / 1024, numberConectDb)
            }
        }, this._SECOND)
    }
}