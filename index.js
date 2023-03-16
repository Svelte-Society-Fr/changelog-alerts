import * as dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(token);

client.on('ready', async () => {
  const channel = client.channels.cache.get(channelId);
  await channel.send('coucou');

  client.destroy();
});
