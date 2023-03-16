import * as dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
const channelId = '1085875010549334036';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(token);

client.on('ready', async () => {
  console.log('connected');
  const channel = client.channels.cache.get(channelId);
  await channel.send('coucou');

  client.destroy();
});
