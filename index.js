import * as dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

import repos from './repos.js';
import getUpdates from './getUpdates.js';
import format from './format.js';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(token);
client.on('ready', async () => {
  const channel = client.channels.cache.get(channelId);

  try {
    const patches = (await Promise.all(repos.map(getUpdates))).flat();
    const embeds = patches.map(format);

    for (let embed of embeds) {
      await channel.send({ embeds: [embed] });
    }
  } catch (e) {
    console.error(e);
  }
  client.destroy();
});
