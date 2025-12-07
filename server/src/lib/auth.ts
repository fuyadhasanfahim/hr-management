import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { client } from './db.js';
import { sendMail } from './nodemailer.js';
import envConfig from '../config/env.config.js';
import { Role } from '../consonants/role.js';

const { db_name, better_auth_secret, trusted_origins } = envConfig;

const mongoClient = await client();
const db = mongoClient.db(db_name);

export const auth = betterAuth({
    secret: better_auth_secret,

    database: mongodbAdapter(db, {
        client: mongoClient,
    }),

    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: Role.EMPLOYEE,
            },
            theme: {
                type: 'string',
                required: false,
                defaultValue: 'system',
            },
        },

        changeEmail: {
            enabled: true,
        },
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },

    emailVerification: {
        sendOnSignUp: true,

        async sendVerificationEmail({ url, user }) {
            await sendMail({
                to: user.email,
                subject: 'Verify Your Email',
                body: `<h1>Hello ${user.name || ''}</h1>
        <p>Please verify your email:</p>
        <a href="${url}">Verify</a>
        <p>If you did not create this account, ignore this email.</p>`,
            });
        },
    },

    trustedOrigins: trusted_origins.split(','),
});
