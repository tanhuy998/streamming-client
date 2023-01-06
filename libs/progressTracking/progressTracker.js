const {EventEmitter} = require('node:events')


class ProgressState {

    get REACHED() {

        return 0x2;
    }

    get PENDING() {

        return 0x0;
    }

    get COMPLETE() {

        return 0x1;
    }
}



/**
 *  A To do list for controlling application's Progress
 */
class ProgressTracker extends EventEmitter {

    /**
     * @property {ProgressTracker}
     */
    #parentProgress;

    /**
     * @property {array<ProgressTracker>}
     */
    #childProgresses;

    /**
     * @property {string}
     */
    #name;

    /**
     * @property {ProgressState}
     */
    #state;

    /** 
     * Uncompleted progress cache
     * 
     * @property {array}
     */
    #uncompletedCache;

    /**
     * 
     * @property {boolean}
     */
    #cacheExpired;

    /**
     *  Constructor
     * 
     * @param {string} _name The Progress's name
     * @param  {...ProgressTracker} list 
     */
    constructor(_name, ...list) {

        this.#childProgresses = list;
        this.#name = _name;
        this.#state = ProgressState.REACHED;
        this.#uncompletedCache = undefined;
        this.#cacheExpired = false;

        this.#Init();
        this.#InitializeEvents();
    }

    #Init() {

        if (!this.#name) throw new Error('Progress object must has a name');

        for (const child of this.#childProgresses) {

            if (!(child instanceof ProgressTracker)) throw new Error('...list must be list of Progress instance');

            if (!child.completed) this.#state = ProgressState.PENDING;            
        }

    }

    #InitializeEvents() {
        this.#events.on('reached', () => {

        });

        this.#events.on('pending', () => {

        })

        this.#events.on('completed', () => {

            this.#state = ProgressState.COMPLETE;


        })

        this.#events.on('update', function(_progress) {


        }.bind(this))
    }

    /**
     *  Acknowledge a child Progress
     *  and update progress state
     *  
     *  Emit event: 'update'
     * 
     * @param {ProgressTracker} _progress 
     * @returns {boolean}
     */
    acknowledge(_progress) {

        if (!_progress.isChildOf(this)) return false;

        if (!_progress.completed) return false;

        if (this.#state == ProgressState.COMPLETE) return false; 


        if (this.#state == ProgressState.REACHED) {

            this.#state = ProgressState.PENDING;

            process.nextTick((_this) => {

                _this.emit('pending', _this)
            }, this)
        }

        process.nextTick((_this) => {
            this.emit('update', _progress)
        }, this, _progress)

        this.#updateState();

        return true;
    }

    #updateState() {

        const uncompleted_progresses = this.uncompleted;

        if (uncompleted_progresses.length != 0) return;

        this.#state = ProgressState.COMPLETE;
    }

    /**
     *  Check if the current Progress is conprehensive
     */
    get isRoot() {

        return (this.#parentProgress == null || this.#parentProgress == undefined);
    }

    /**
     * 
     * @param {ProgressTracker} _progress 
     * @returns {boolean}
     */
    push(_progress) {

        if (this.#progresses_list[_progress.name]) return false;

        if (!_progress.isRoot) return false;

        this.#progresses_list[_progress.name] = _progress;

        return true;
    }

    /**
     * 
     * @param {ProgressTracker} _progress 
     */
    isChildOf(_progress) {

        return (this.#parentProgress === _progress);
    }

    get completed() {



        return (this.#state == ProgressState.COMPLETE);
    }

    get name() {

        return this.#name;
    }

    get uncompleted() {

        if (!this.#cacheExpired) return this.#uncompletedCache; 

        this.#uncompletedCache = Object.keys(this.#childProgresses)
                    .filter(function (name) {
                    
                        const progress = this.#childProgresses[name]

                        return (!progress.completed);
                    }.bind(this));

        this.#cacheExpired = fasle;

        return this.#uncompletedCache;
    }
}

module.exports = {ProgressTracker, ProgressState};