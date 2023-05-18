import * as dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

import repos from './repos.js';
import { getChangelog } from './utils.js';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(token);
client.on('ready', async () => {
  const channel = client.channels.cache.get(channelId);

  try {
    const patches = await Promise.all(repos.map(getChangelog));
    for (let patch of patches.filter(Boolean)) {
      await channel.send(patch);
    }
  } catch (e) {
    console.error(e);
  }
  client.destroy();
});
