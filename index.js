import * as dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN;
const channelId = '1085875010549334036';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(token);

client.on('ready', () => {
  console.log('Connected');

  const channel = client.channels.cache.get(channelId);
  channel.send('coucou');
});
