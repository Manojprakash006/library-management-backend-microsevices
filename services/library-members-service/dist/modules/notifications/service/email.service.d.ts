import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, html: string): Promise<boolean>;
    sendDueDateReminder(to: string, memberName: string, bookTitle: string, dueDate: Date): Promise<boolean>;
    sendOverdueNotification(to: string, memberName: string, bookTitle: string, dueDate: Date, fine: number): Promise<boolean>;
    sendPasswordResetEmail(to: string, memberName: string, resetToken: string): Promise<boolean>;
}
