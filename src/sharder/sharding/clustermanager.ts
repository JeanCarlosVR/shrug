const master = require("cluster");
import cluster from "./cluster";
const numCPUs = require('os').cpus().length;
import logger from '../../utils/Logger';
const EventEmitter = require("events");
const Eris = require("eris");
import Queue from "../../utils/Queue";
const clientName = "Shrug";
const clusterManagerName = `${clientName} Clusters`;
const clusterName = `${clusterManagerName} / Cluster`;
const generalLog = "Master";

/**
 * 
 * 
 * @class ClusterManager
 * @extends {EventEmitter}
 */
class ClusterManager extends EventEmitter {
    /**
     * Creates an instance of ClusterManager.
     * @param {any} token 
     * @param {any} mainFile 
     * @param {any} options 
     * @memberof ClusterManager
     */
    public constructor(token, mainFile, options) {
        super();
        this.shardCount = options.shards || 0;
        this.firstShardID = options.firstShardID || 0;
        this.lastShardID = options.lastShardID || (this.shardCount - 1);
        this.clusterCount = options.clusters || numCPUs;
        this.clusterTimeout = options.clusterTimeout * 1000 || 5000;
        this.token = token || false;
        this.clusters = new Map();
        this.workers = new Map();
        this.queue = new Queue();
        this.options = {
            stats: options.stats || false
        };
        this.statsInterval = options.statsInterval || 60 * 1000;
        this.mainFile = mainFile;
        this.name = "Crybaby";
        this.guildsPerShard = options.guildsPerShard || 1300;
        this.webhooks = {
            cluster: {
                id: "745834960979755079",
                token: "D7vy_PLQoMjf5b-AniY7zDNH0YWYd38IEBG_PRh8fRZPgQvsZAyPC9uV1EuPXDWrY5gK"
            },
            shard: {
                id: "745834960979755079",
                token: "D7vy_PLQoMjf5b-AniY7zDNH0YWYd38IEBG_PRh8fRZPgQvsZAyPC9uV1EuPXDWrY5gK"
            }
        };

        this.options.debug = options.debug || false;
        this.clientOptions = options.clientOptions || {};
        this.callbacks = new Map();

        if (options.stats === true) {
            this.stats = {
                stats: {
                    guilds: 0,
                    users: 0,
                    totalRam: 0,
                    voice: 0,
                    exclusiveGuilds: 0,
                    largeGuilds: 0,
                    clusters: []
                },
                clustersCounted: 0
            }
        }

        if (this.token) {
            this.eris = new Eris(token);
            this.launch();
        } else {
            throw new Error("No token provided");
        }
    }

    public isMaster() {
        return master.isMaster;
    }

    public startStats() {
        if (this.statsInterval != null) {
            setInterval(() => {
                this.stats.stats.guilds = 0;
                this.stats.stats.users = 0;
                this.stats.stats.totalRam = 0;
                this.stats.stats.clusters = [];
                this.stats.stats.voice = 0;
                this.stats.stats.exclusiveGuilds = 0;
                this.stats.stats.largeGuilds = 0;
                this.stats.clustersCounted = 0;

                let clusters = Object.entries(master.workers);

                this.executeStats(clusters, 0);
            }, this.statsInterval);
        }
    }

    /**
     * 
     * 
     * @param {any} start 
     * @memberof ClusterManager
     */
    public executeStats(clusters, start) {
        const clusterToRequest = clusters.filter(c => c[1].state === 'online')[start];
        if (clusterToRequest) {
            let c = clusterToRequest[1];

            c.send({ name: "stats" });

            this.executeStats(clusters, start + 1);
        }
    }


    /**
     * 
     * 
     * @param {any} amount 
     * @param {any} numSpawned 
     * @memberof ClusterManager
     */
    public start(clusterID) {
        if (clusterID === this.clusterCount) {
            logger.info(clusterManagerName, "All Clusters have been initialized!");

            let shards = [];

            for (let i = this.firstShardID; i <= this.lastShardID; i++) {
                shards.push(i);
            }

            let chunkedShards = this.chunk(shards, this.clusterCount);

            chunkedShards.forEach((chunk, clusterID) => {
                let cluster = this.clusters.get(clusterID);

                this.clusters.set(clusterID, Object.assign(cluster, {
                    firstShardID: Math.min(...chunk),
                    lastShardID: Math.max(...chunk)
                }));
            });

            this.connectShards();
        } else {
            let worker = master.fork();
            this.clusters.set(clusterID, { workerID: worker.id });
            this.workers.set(worker.id, clusterID);
            logger.info(clusterManagerName, `Initializing cluster ${clusterID}`);
            clusterID += 1;

            this.start(clusterID);
        }
    }

    /**
     * 
     * 
     * @memberof ClusterManager
     */
    public launch() {
        if (master.isMaster) {
            process.on("uncaughtException", err => {
                logger.error(generalLog, err.stack);
            });

            this.printLogo();

            process.nextTick(async () => {
                logger.info(generalLog, "Cluster Manager has started!");

                let shards = await this.calculateShards();

                this.shardCount = shards;
                this.lastShardID = this.shardCount - 1;

                logger.info(clusterManagerName, `${this.shardCount} shards in ${this.clusterCount} clusters`);

                let embed = {
                    description: `**${this.shardCount}** Shards will be initializing.`,
                    color: 0x32FF00
                }

                this.sendWebhook("cluster", embed);

                master.setupMaster({
                    silent: false
                });

                // Fork workers.
                this.start(0);
            });
        } else if (master.isWorker) {
            const Cluster = new cluster();
            Cluster.spawn();
        }

        master.on('message', (worker, message, handle) => {
            if (message.name) {
                const clusterID = this.workers.get(worker.id);

                switch (message.name) {
                    case "log":
                        logger.log(`Cluster ${clusterID}`, `${message.msg}`);
                        break;
                    case "debug":
                        if (this.options.debug) {
                            logger.debug(`Cluster ${clusterID}`, `${message.msg}`);
                        }
                        break;
                    case "info":
                        logger.info(`Cluster ${clusterID}`, `${message.msg}`);
                        break;
                    case "warn":
                        logger.warn(`⚠️ Cluster ${clusterID}`, `${message.msg}`);
                        break;
                    case "error":
                        logger.error(`❌ Cluster ${clusterID}`, `${message.msg}`);
                        break;
                    case "shardsStarted":
                        this.queue.queue.splice(0, 1);

                        if (this.queue.queue.length > 0) {
                            setTimeout(() => this.queue.executeQueue(), this.clusterTimeout);
                        }
                        break;
                    case "cluster":
                        this.sendWebhook("cluster", message.embed);
                        break;
                    case "shard":
                        this.sendWebhook("shard", message.embed);
                        break;
                    case "stats":
                        this.stats.stats.guilds += message.stats.guilds;
                        this.stats.stats.users += message.stats.users;
                        this.stats.stats.voice += message.stats.voice;
                        this.stats.stats.totalRam += message.stats.ram;
                        let ram = message.stats.ram / 1000000;
                        this.stats.stats.exclusiveGuilds += message.stats.exclusiveGuilds;
                        this.stats.stats.largeGuilds += message.stats.largeGuilds;
                        this.stats.stats.clusters.push({
                            cluster: clusterID,
                            shards: message.stats.shards,
                            guilds: message.stats.guilds,
                            ram: ram,
                            voice: message.stats.voice,
                            uptime: message.stats.uptime,
                            exclusiveGuilds: message.stats.exclusiveGuilds,
                            largeGuilds: message.stats.largeGuilds,
                            shardsStats: message.stats.shardsStats
                        });

                        this.stats.clustersCounted += 1;

                        if (this.stats.clustersCounted === this.clusters.size) {
                            function compare(a, b) {
                                if (a.cluster < b.cluster)
                                    return -1;
                                if (a.cluster > b.cluster)
                                    return 1;
                                return 0;
                            }

                            let clusters = this.stats.stats.clusters.sort(compare);

                            this.emit("stats", {
                                guilds: this.stats.stats.guilds,
                                users: this.stats.stats.users,
                                voice: this.stats.stats.voice,
                                exclusiveGuilds: this.stats.stats.exclusiveGuilds,
                                largeGuilds: this.stats.stats.largeGuilds,
                                totalRam: this.stats.stats.totalRam / 1000000,
                                clusters: clusters
                            });
                        }
                        break;

                    case "fetchUser":
                        this.fetchInfo(0, "fetchUser", message.id);
                        this.callbacks.set(message.id, clusterID);
                        break;
                    case "fetchGuild":
                        this.fetchInfo(0, "fetchGuild", message.id);
                        this.callbacks.set(message.id, clusterID);
                        break;
                    case "fetchChannel":
                        this.fetchInfo(0, "fetchChannel", message.id);
                        this.callbacks.set(message.id, clusterID);
                        break;
                    case "fetchMember":
                        this.fetchInfo(0, "fetchMember", [message.guildID, message.memberID]);
                        this.callbacks.set(message.memberID, clusterID);
                    case "fetchReturn":
                        console.log(message);
                        let callback = this.callbacks.get(message.value.id);

                        let cluster = this.clusters.get(callback);

                        if (cluster) {
                            master.workers[cluster.workerID].send({ name: "fetchReturn", id: message.value.id, value: message.value });
                            this.callbacks.delete(message.value.id);
                        }
                        break;
                    case "broadcast":
                        this.broadcast(0, message.msg);
                        break;
                    case "send":
                        this.sendTo(message.cluster, message.msg)
                        break;
                }
            }
        });

        master.on('disconnect', (worker) => {
            const clusterID = this.workers.get(worker.id);
            logger.warn(clusterManagerName, `Cluster ${clusterID} disconnected 🔌`);
        });

        master.on('exit', (worker, code, signal) => {
            this.restartCluster(worker, code, signal);
        });

        this.queue.on("execute", item => {
            let cluster = this.clusters.get(item.item);

            if (cluster) {
                master.workers[cluster.workerID].send(item.value);
            }
        });
    }

    public chunk(shards, clusterCount) {

        if (clusterCount < 2) return [shards];

        let len = shards.length;
        let out = [];
        let i = 0;
        let size;

        if (len % clusterCount === 0) {
            size = Math.floor(len / clusterCount);

            while (i < len) {
                out.push(shards.slice(i, i += size));
            }
        } else {
            while (i < len) {
                size = Math.ceil((len - i) / clusterCount--);
                out.push(shards.slice(i, i += size));
            }
        }

        return out;
    }

    public connectShards() {
        for (let clusterID in [...Array(this.clusterCount).keys()]) {
            let clusterID_Identificator = parseInt(`${clusterID}`);

            let cluster = this.clusters.get(clusterID_Identificator);

            if (!cluster.hasOwnProperty('firstShardID')) break;

            this.queue.queueItem({
                item: clusterID_Identificator,
                value: {
                    id: clusterID_Identificator,
                    clusterCount: this.clusterCount,
                    name: "connect",
                    firstShardID: cluster.firstShardID,
                    lastShardID: cluster.lastShardID,
                    maxShards: this.shardCount,
                    token: this.token,
                    file: this.mainFile,
                    clientOptions: this.clientOptions,
                }
            });
        }

        logger.info(clusterManagerName, `Initializing all shards ❄️`);

        if (this.stats) {
            this.startStats();
        }
    }

    /**
     * 
     * 
     * @param {any} type 
     * @param {any} embed 
     * @memberof ClusterManager
     */
    public sendWebhook(type, embed) {
        if (!this.webhooks || !this.webhooks[type]) return;
        let id = this.webhooks[type].id;
        let token = this.webhooks[type].token;
        if (id && token) {
            this.eris.executeWebhook(id, token, { embeds: [embed], username: "Crybaby ¯\\_(ツ)_/¯", avatarURL: "https://steamuserimages-a.akamaihd.net/ugc/923679727840075721/C4CE3E67AE9829161A07537B5100D1AA9B1BA0EA/" });
        }
    }

    public printLogo() {
        const logo = require('asciiart-logo');
        console.log(
            logo({
                name: this.name,
                font: 'Big',
                lineChars: 15,
                padding: 2,
                margin: 4
            })
                .emptyLine()
                .right(`Crybaby 0.1.0`)
                .emptyLine()
                .render()
        );
    }

    public restartCluster(worker, code, signal) {
        const clusterID = this.workers.get(worker.id);

        logger.warn(clusterManagerName, `Cluster ${clusterID} died 💀`);

        let cluster = this.clusters.get(clusterID);

        let embed = {
            description: `Cluster ${clusterID} is dead. Restarting... 🔁`,
            color: 0xFF0000
        }

        this.sendWebhook("cluster", embed);

        let shards = cluster.shardCount;

        let newWorker = master.fork();

        this.workers.delete(worker.id);

        this.clusters.set(clusterID, Object.assign(cluster, { workerID: newWorker.id }));

        this.workers.set(newWorker.id, clusterID);

        logger.debug(clusterManagerName, `Restarting cluster ${clusterID} 🔁`);

        this.queue.queueItem({
            item: clusterID, value: {
                id: clusterID,
                clusterCount: this.clusterCount,
                name: "connect",
                shards: shards,
                firstShardID: cluster.firstShardID,
                lastShardID: cluster.lastShardID,
                maxShards: this.shardCount,
                token: this.token,
                file: this.mainFile,
                clientOptions: this.clientOptions,
                test: this.test
            }
        });
    }

    public async calculateShards() {
        let shards = this.shardCount;

        if (this.shardCount !== 0) return Promise.resolve(this.shardCount);

        let result = await this.eris.getBotGateway();
        shards = result.shards;

        if (shards === 1) {
            return Promise.resolve(shards);
        } else {
            let guildCount = shards * 1000;
            let guildsPerShard = this.guildsPerShard;
            let shardsDecimal = guildCount / guildsPerShard;
            let finalShards = Math.ceil(shardsDecimal);
            return Promise.resolve(finalShards);
        }
    }

    public fetchInfo(start, type, value) {
        let cluster = this.clusters.get(start);
        if (cluster) {
            master.workers[cluster.workerID].send({ name: type, value: value });
            this.fetchInfo(start + 1, type, value);
        }
    }

    public broadcast(start, message) {
        let cluster = this.clusters.get(start);
        if (cluster) {
            master.workers[cluster.workerID].send(message);
            this.broadcast(start + 1, message);
        }
    }

    public sendTo(cluster, message) {
        let worker = master.workers[this.clusters.get(cluster).workerID];
        if (worker) {
            worker.send(message);
        }
    }
}

export = ClusterManager;