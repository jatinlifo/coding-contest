import cron from 'node-cron';
import { cleanupOldContests } from '../utils/cleanupt.js';

cron.schedule("0 3 * * *", async() => {
    console.log("Running contest cleanup jon...0");
    await cleanupOldContests();
})