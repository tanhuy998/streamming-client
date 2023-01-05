const {EventChannelResolver} = require('./eventChannelResolver.js');
const {EventEmitter} = require('events')

const target = new EventEmitter();

const wrapper = new EventChannelResolver(target);

wrapper.on('start')
        .sub('do')
        .sub('log')
        .do(() => { console.log("channeled event 'start:do:log' emmitted"); })
        .do(() => console.log("second callback for 'start:do:log' channeled event"));

target.emit('start:do:log');

wrapper.on('start')
        .sub('do')
        .sub('log')
        .emit()

