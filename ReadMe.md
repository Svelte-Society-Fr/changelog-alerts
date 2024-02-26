# Svelte alerts

Tracks updates in the changelogs of Svelte and SvelteKit repos and send a message in a dedicated channel on a Discord Server.

> Note: Currently only tracking SvelteKit main repo

## Usage

1. Create a Discord app, with its bot, using [Discord web interface](https://discord.com/developers/applications), then connect it to your server using the generated HTML link. Don't forget to give it message permissions.

2. Create a dedicated channel in your server.

### In an actual Github Action

3. Create the following environment variables in your repo:
    - `DISCORD_BOT_TOKEN`: your bot's token
    - `DISCORD_CHANNEL_ID`: your channel's id

4. Use the action

### Locally

> Don't forget to `pnpm i`.

3. Copy-paste the `.env-template` file as `.env`, and fill the different environment variables, as described earlier.

4. Run
```js
node index.js
```
