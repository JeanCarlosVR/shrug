const EventEmitter = require("events");
/**
 * 
 * 
 * @class Queue
 * @extends {EventEmitter}
 */
export = class Queue extends EventEmitter {
    /**
     * Creates an instance of Queue.
     * @memberof Queue
     */
    public constructor() {
        super();
        this.queue = [];
    }

    public executeQueue() {
        let item = this.queue[0];

        if (!item) return;
        this.emit("execute", item);
    }

    /**
     * 
     * 
     * @param {any} item 
     * @memberof Queue
     */
    public queueItem(item) {
        if (this.queue.length === 0) {
            this.queue.push(item);
            this.executeQueue();
        } else {
            this.queue.push(item);
        }
    }
}