const {EventEmitter} = require('node:events')


class ProgressState {

    static get REACHED() {

        return -1;
    }

    static get PENDING() {

        return 0x0;
    }

    static get COMPLETE() {

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
     * 
     * @property {Symbol}
     */
    #symbol

    /**
     *  Constructor
     * 
     * @param {string} _name The Progress's name
     * @param  {...ProgressTracker} list 
     */
    constructor(_name, ...list) {

        super();

        this.#childProgresses = list;
        this.#name = _name;
        this.#state = ProgressState.REACHED;
        this.#uncompletedCache = undefined;
        this.#cacheExpired = true;
        this.#symbol = Symbol(_name);

        this.#Init();
        this.#InitializeEvents();

        this.#state = ProgressState.PENDING;
        console.log(this.#childProgresses);
    }

    #Init() {

        if (!this.#name) throw new Error('Progress object must has a name');

        const temp = {};

        for (const child of this.#childProgresses) {

            if (!(child instanceof ProgressTracker)) throw new Error('...list must be list of Progress instance');
        
            temp[child.symbolName] = child;
        }

        this.#childProgresses = temp;
    }

    #InitializeEvents() {
        this.on('reached', () => {

        });

        this.on('pending', () => {

        })

        this.on('completed', () => {


        })

        this.on('update', function(_progress) {


        }.bind(this))
    }

    /**
     *  Acknowledge a child Progress
     *  and update internal progress state
     *  
     *  Emit event: 'update'
     * 
     * @param {ProgressTracker} _progress 
     * @returns {boolean}
     */
    acknowledge(_progress) {

        // just only a parent progress acknowledges it's child
        if (!this.isAtomic) return false;

        if (!_progress.isChildOf(this)) return false;

        if ((!_progress.completed)) return false;

        if (this.#state == ProgressState.COMPLETE) return false; 

        // when met all prerequesites above

        if (this.#state == ProgressState.REACHED) {

            this.#state = ProgressState.PENDING;

            process.nextTick((_this) => {

                _this.emit('pending', _this)
            }, this)
        }

        this.#cacheExpired = true;

        this.#updateState();

        process.nextTick((_this, _progress) => {
            
            this.emit('update', _progress)
        }, this, _progress)

        return true;
    }
    /**
     * Mark this progress is completed
     * This method is used for atomic progress
     * 
     * @return {boolean}
     */
    done() {

        if (!this.isAtomic) return false;

        this.#state = ProgressState.COMPLETE;

        process.nextTick((_this) => {

            _this.emit('completed');
        }, this)

        return this.#parentProgress.acknowledge(this);
    }


    /**
     * Check if this is atomic progress
     * 
     * *Atomic progress meanning that a progress has no sub(child) progresses
     */
    get isAtomic() {

        return (this.#childProgresses.length == 0);
    }

    /**
     *  Update a non atomic progress's state
     *  If all child processes completed
     *  Notify parent progress for acknowledgement
     */
    #updateState() {

        const uncompleted_progresses = this.uncompleted;

        if (uncompleted_progresses.length != 0) return;
        
        this.#state = ProgressState.COMPLETE;

        process.nextTick((_this) => {

            _this.emit('completed');
        }, this)

        this.#parentProgress.acknowledge(this);
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

        if (this.#childProgresses[_progress.symbolName]) return false;

        if (!_progress.isRoot) return false;

        this.#childProgresses[_progress.symbolName] = _progress;

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

    get symbolName() {

        return this.#symbol;
    }

    /**
     * List of uncompleted progress's name
     * 
     * @return {array<string>} eg. ['progress1', 'progress2', 'progress3']
     */
    get uncompleted() {

        if (!this.#cacheExpired) return this.#uncompletedCache; 

        this.#uncompletedCache = Object.keys(this.#childProgresses)
                                    .filter(function (name) {
                                        
                                        const progress = this.#childProgresses[name]

                                        return (!progress.completed);
                                    }.bind(this));
                
        this.#cacheExpired = false;
        
        // just return list of uncompleted progress's name
        return this.#uncompletedCache;
    }
}

module.exports = {ProgressTracker, ProgressState};