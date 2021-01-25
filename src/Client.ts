import mongoose from 'mongoose';
import Mongoose from './database/connection';
const Sharder = require("./sharder/index").Master;

export default class Client {

  protected token;

  constructor(token) {
    this.token = token;

    let clientSharder = new Sharder(this.token, "/dist/base", {
      clientOptions: {
        restMode: true,
        messageLimit: 100,
        autoreconnect: true,
        setMaxListeners: 0,
        defaultImageFormat: "png",
        compress: true,
        guildSubscriptions: false,
        requestTimeout: 20000,
        allowedMentions: {
          everyone: false
        },
        disableEvents: {
          GUILD_UPDATE: false,
          CHANNEL_CREATE: false,
          CHANNEL_UPDATE: false,
          CHANNEL_DELETE: false,
          CHANNEL_OVERWRITE_CREATE: true,
          CHANNEL_OVERWRITE_UPDATE: true,
          CHANNEL_OVERWRITE_DELETE: true,
          MEMBER_KICK: true,
          MEMBER_PRUNE: true,
          MEMBER_BAN_ADD: true,
          MEMBER_BAN_REMOVE: true,
          MEMBER_UPDATE: true,
          MEMBER_ROLE_UPDATE: false,
          MEMBER_MOVE: true,
          MEMBER_DISCONNECT: true,
          BOT_ADD: false,
          ROLE_CREATE: true,
          ROLE_UPDATE: true,
          ROLE_DELETE: true,
          INVITE_CREATE: true,
          INVITE_UPDATE: true,
          INVITE_DELETE: true,
          WEBHOOK_CREATE: true,
          WEBHOOK_UPDATE: true,
          WEBHOOK_DELETE: true,
          EMOJI_CREATE: true,
          EMOJI_UPDATE: true,
          EMOJI_DELETE: true,
          MESSAGE_DELETE: false,
          MESSAGE_BULK_DELETE: false,
          MESSAGE_PIN: true,
          MESSAGE_UNPIN: true,
          MESSAGE_CREATE: false,
          MESSAGE_REACTION_ADD: false,
          MESSAGE_REACTION_REMOVE: true,
          INTEGRATION_CREATE: true,
          INTEGRATION_UPDATE: true,
          INTEGRATION_DELETE: true
        }
      },
      stats: true,
      clusters: 1,
      shards: 1,
      debug: true,
      name: "Jean",
      statsInterval: 45000,
      setMaxListeners: 0,
      intents: 1539
    });

    new Mongoose(mongoose).connect();

    clientSharder.on("stats", async (stats) => {
      stats.updated = Date.now();
      console.log(stats);
    });
  }
}