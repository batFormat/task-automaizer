import axios from 'axios'
import config from '../config';
import { Notion } from '../models';
import ReportService from './ReportService';
import NotionService from './NotionService';

export default class NotificationService {
    constructor(public notion: NotionService) {
    }

    async notify() {
        try {
            // Get active tasks from Notion board
            const tasks = await this.getTasks();

            if (!tasks) {
                await this.sendMessage(ReportService.getFallbackDailyReportMessage())
                return;
            }

            const report = new ReportService(tasks);

            // Log formed daily task report
            console.log(report.getDailyReportMessage())

            // Send formed daily task report to Telegram Chat
            await this.sendMessage(report.getDailyReportMessage())

            await this.markAsArchived(tasks.results)
        } catch (e) {
            console.log(e)
        }
    }

    async sendMessage(text: string) {
        try {
            console.log(`https://api.telegram.org/bot${config.telegramToken}/sendMessage`);

            const response = await axios.get(`https://api.telegram.org/bot${config.telegramToken}/sendMessage`, {
                params: {
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    chat_id: config.telegramChatId,
                    text,
                }
            })

            // Log telegram message send response
            console.log(JSON.stringify(response.data));
        } catch (error) {
            console.error((error as any).response.data);
        }
    }

    private getTasks() {
        const filter = {
            property: "Status",
            status: {
                does_not_equal: Notion.StatusEnum.Backlog
            }
        }

        return this.notion.databaseQuery(filter, [
            {
                property: "Priority",
                direction: "ascending"
            }
        ]
        )
    }

    private async markAsArchived(tasks: Notion.Page[]) {
        // Архивируем завершенные задачи
        for (const { id: block_id, properties: { Status: { status } } } of tasks) {
            if (status.name === Notion.StatusEnum.Done) {
                this.notion.client.blocks.delete({
                    block_id
                })
            }
        }
    }
}