const colors = require("colors");

colors.setTheme({
    silly: 'rainbow',
    log: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'cyan',
    error: 'red'
});

import log from 'fancy-log';

/**
 * 
 * 
 * @class Logger
 */
class Logger {
    public constructor() {

    }

    /**
     * 
     * 
     * @param {any} source 
     * @param {any} msg 
     * @memberof Logger
     */
    public log(source, msg) {
        let message = colors.log(msg)
        log(`${source} | ${message}`);
    }

    /**
     * 
     * 
     * @param {any} source 
     * @param {any} msg 
     * @memberof Logger
     */
    public info(source, msg) {
        let message = colors.verbose(msg)
        log(`${source} | ${message}`);
    }

    /**
     * 
     * 
     * @param {any} source 
     * @param {any} msg 
     * @memberof Logger
     */
    public warn(source, msg) {
        let message = colors.warn(msg)
        log(`${source} | ${message}`);
    }

    /**
     * 
     * 
     * @param {any} source 
     * @param {any} msg 
     * @memberof Logger
     */
    public error(source, msg) {
        let message = colors.error(msg)
        log(`${source} | ${message}`);
    }

    /**
     * 
     * 
     * @param {any} source 
     * @param {any} msg 
     * @memberof Logger
     */
    public data(source, msg) {
        let message = colors.data(msg)
        log(`${source} | ${message}`);
    }

    /**
     * 
     * 
     * @param {any} source 
     * @param {any} msg 
     * @memberof Logger
     */
    public debug(source, msg) {
        let message = colors.debug(msg)
        log(`${source} | ${message}`);
    }

    public load(source, msg) {
        let message = colors.info(msg)
        log(`${source} | ${message}`);
    }
}

export = new Logger();
