import { isNotionClientError, ClientErrorCode, APIErrorCode } from '@notionhq/client';
import { plainToInstance } from 'class-transformer';
import { Client } from '@notionhq/client';
import { Notion } from '../models';
import config from '../config'

export default class NotionService {
    public client: Client;

    constructor(client: Client) {
        // Initializing a client
        this.client = client
    }

    async databaseQuery(filter: any, sorts: any = undefined) {
        try {
            const response = await this.client.databases.query({
                database_id: config.databaseId,
                filter,
                sorts
            })

            return plainToInstance(Notion.List, response, { excludeExtraneousValues: true });
        } catch (error: unknown) {
            if (isNotionClientError(error)) {
                // error is now strongly typed to NotionClientError
                switch (error.code) {
                    case ClientErrorCode.RequestTimeout:
                        // ...
                        break
                    case APIErrorCode.ObjectNotFound:
                        // ...
                        break
                    case APIErrorCode.Unauthorized:
                        // ...
                        break
                    // ...
                    default:
                        // you could even take advantage of exhaustiveness checking
                        console.log(error.code)
                }
            }
        }
    }
}