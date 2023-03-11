import * as mongoose from 'mongoose';

export interface AuthenticatorSchemaProps {
    userId: String;
    authCode: String;
    dateTimeCreate: Date;
}

const Schema = mongoose.Schema;

export const AuthenticatorSchema = new Schema<AuthenticatorSchemaProps>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        authCode: {
            type: String,
            required: true,
        },
        dateTimeCreate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);
