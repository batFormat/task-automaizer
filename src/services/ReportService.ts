import dayjs from 'dayjs'
import { Notion } from '../models';

export default class ReportService {
    private header: Array<string>;
    private fact: Array<string>;
    private plan: Array<string>;

    tasks: Notion.Page[];

    constructor(tasks: Notion.List) {
        this.tasks = tasks.results;

        this.init()

        this.setHeaderBlock()

        this.setFactBlock()
        this.setPlanBlock()

        this.setPlanCompletionPercentage()
    }

    init() {
        // Header message
        const startDate = dayjs().startOf('week').format('DD.MM');
        const endDate = dayjs().endOf('week').format('DD.MM');

        this.header = [
            `<b>План на неделю ${startDate}–${endDate}:</b>`,
        ]

        // fact message
        this.fact = [`<b>Факт ${dayjs().subtract(1, 'day').format('DD.MM')}</b>`]

        // Plan message
        this.plan = [`<b>План ${dayjs().format('DD.MM')}</b>`]
    }

    async setHeaderBlock() {
        const tasks = this.tasks.filter((task) => task.properties.KPI.checkbox)

        for (const { properties } of tasks) {
            const name = properties.Name.title[0].plain_text;
            const status = properties.Status.status.name;

            const prefix = status === Notion.StatusEnum.Done ? '[+]' : '[-]';

            this.header.push(`<pre>${prefix} ${name}</pre>`)
        };
    }

    async setFactBlock() {
        for (const { properties } of this.getTaskForFact()) {
            const name = properties.Name.title[0].plain_text;

            const status = properties.Status.status.name;

            const prefix = status === Notion.StatusEnum.Done ? '[+]' : '[-]';

            this.fact.push(`<pre>${prefix} ${name}</pre>`)
        };
    }

    setPlanCompletionPercentage(): void {
        const doneTasks = this.getTaskForFact()
            .filter((task) => task.properties.Status.status.name === Notion.StatusEnum.Done);

        const percent = (doneTasks.length / this.getTaskForFact().length) * 100;

        this.fact.push(
            `<b>Процент закрытия плана на день: ${Math.round(percent)}%</b>`
        )
    }

    async setPlanBlock() {
        const tasks = this.getTaskWithoutKPI()
            .filter((task) => task.properties.Status.status.name !== Notion.StatusEnum.Done)

        let index = 1;

        for (const { properties } of tasks) {
            const name = properties.Name.title[0].plain_text;

            this.plan.push(`<pre>${index++}. ${name}</pre>`)
        };
    }

    static getFallbackDailyReportMessage(): string {
        return `План:\n1.Дейли митап\n2. Ревью MR\n3.Изучить и приоритезировать баги в Sentry`
    }

    getTaskWithoutKPI() {
        return this.tasks.filter((task) => !task.properties.KPI.checkbox)
    }

    getTaskForFact() {
        return this.getTaskWithoutKPI()
            // Only tasks created no earlier than six hours ago
            .filter(({ created_time }) => dayjs().diff(created_time, 'hours') > 6)

    }

    getDailyReportMessage(): string {
        const newLine = '\n\n';

        let message: Array<String> = [
            this.header.join('\n'),
            this.fact.join('\n'),
            this.plan.join('\n'),
        ];

        return message.join(newLine)
    }
}