import { registerAs } from "@nestjs/config";

export default registerAs('googleOAuth', () => ({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    applicationRedirectUrl: process.env.APPLICATION_REDIRECT_URL || 'http://localhost:8081/onboarding-success'
}));