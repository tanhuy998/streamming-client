const {EventEmitter} = require('node:events');
const {ProgressState, ProgressTracker} = require('./progressTracker');


class ProgressListener extends EventEmitter{

    /**
     *  Set of progresses that 
     * 
     * @property {ProgressTracker} 
     */
    #progressSet;

    #name;

    #symbolName;

    #cacheProgression;

    #cacheExpire;

    #numberOfProgress;

    #state;

    constructor(_name, ..._progressSet) {

        super();

        this.#name = _name;
        this.#symbolName = Symbol(_name);
        this.#cacheProgression = undefined;
        this.#cacheExpire = true;
        this.#progressSet = _progressSet;
        this.#state = ProgressState.REACHED;
        this.#numberOfProgress = _progressSet.length;

        this.#Init();
        this.#InitializeEvent();
    }

    #Init() {

        this.#state = ProgressState.PENDING;

        const temp = {};

        let is_AllDone = true;

        for (const progress of this.#progressSet) {

            if (!(progress instanceof ProgressTracker)) throw new Error('_progressSet must be instance of ProgressTracker');

            const symbolName = progress.symbolName;

            temp[symbolName] = progress;

            if (!progress.completed) is_AllDone = false;
        }

        this.#progressSet = temp;

    }

    #InitializeEvent() {

        this.on('progress', (_finishedProgress) => {

        })

        this.on('finish', (_progressSet) => {


        })

        this.on('envole', (_newProgress) => {

        })
    }

    #notiy(_event, ...arg) {

        process.nextTick((function(..._arg) {

            this.emit(_event, ..._arg);
        }).bind(this), ...arg)
    }

    check() {

        let finished_progesses = 0;

        for (const progress of this.#progressSet) {

            if (progress.completed) finished_progesses++;
        }

        if (finished_progesses > this.#cacheProgression.length) {

            this.#cacheExpire = true;

            this.#notiy('progress', this.#cacheProgression);

            
        }

        if (finished_progesses == this.#numberOfProgress) {

            this.#cacheExpire = true;

            this.#notiy('finish', this.#cacheProgression);
        }
    }

    get finished() {

        return this.#state == ProgressState.COMPLETE;
    }

    get progression() {

        if (!this.#cacheExpire) return this.#cacheProgression;

        return Reflect.ownKeys(this.#progressSet)
                        .filter((function(symbol) {

                            return (this.#progressSet[symbol].completed);
                        }).bind(this))
    }
}

module.exports = ProgressListener;