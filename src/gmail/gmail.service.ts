import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GmailService {
    constructor(private readonly configService: ConfigService) { }
    async getLatestEmails(refreshToken: string) {
        const oauth2Client = new google.auth.OAuth2(
            this.configService.get<string>('GOOGLE_CLIENT_ID'),
            this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
            this.configService.get<string>('GOOGLE_CALLBACK_URL'),
        );

        oauth2Client.setCredentials({ refresh_token: refreshToken });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        try {
            // 2. Fetch the list of the last 5 messages
            const listResponse = await gmail.users.messages.list({
                userId: 'me',
                maxResults: 5,
            });

            const messages = listResponse.data.messages || [];

            // 3. Fetch details for each message to get the "Snippet"
            const emailDetails = await Promise.all(
                messages.map(async (msg) => {
                    const detail = await gmail.users.messages.get({
                        id: msg.id as string,
                        userId: 'me',
                        format: 'minimal'
                    });
                    return {
                        id: detail.data.id,
                        snippet: detail.data.snippet,
                    };
                }),
            );

            return emailDetails;
        } catch (error) {
            console.log('ERROR::', error)
            throw new InternalServerErrorException('Failed to bridge with Gmail');
        }
    }
}
