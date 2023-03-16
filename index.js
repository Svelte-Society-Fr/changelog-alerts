import * as dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

import { getChangelog } from './lib.js';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
const channelId = '1085875010549334036';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(token);

const path = 'packages/kit/CHANGELOG.md';

client.on('ready', async () => {
  console.log('connected');
  const channel = client.channels.cache.get(channelId);

  const patch = await getChangelog(path);

  await channel.send(patch);

  client.destroy();
});
