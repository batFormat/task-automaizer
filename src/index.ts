import 'reflect-metadata';
import { Client } from '@notionhq/client';
import config from './config'
import NotionService from './services/NotionService';
import NotificationService from './services/NotificationService';

import './utils'

const client = new Client({
  auth: config.notionToken,
})

async function main() {
  const notion = new NotionService(client);
  const notification = new NotificationService(notion)

  await notification.notify()
}

main()