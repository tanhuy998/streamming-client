//-----------------------------------------------------------------------------------------------
//------------------------------------EXAMPLE 1-------------------------------------------
console.log('------------------------EXAMPLE 1 -----------------------------------------')

const {ProgressTracker, ProgressState} = require('./progressTracker.js');
const ProgressListener  = require('./progressListener.js');



const sub_progress1_2_1 = new ProgressTracker('buy-beef')

const sub_progress1_2 = new ProgressTracker('slice-beef', sub_progress1_2_1);

const sub_progress1 = new ProgressTracker('prepare-beef', sub_progress1_2);


const sub_progress2 = new ProgressTracker('make-sauce');

const main_progress = new ProgressTracker('make-beefsteak', sub_progress1, sub_progress2);


sub_progress1_2.done();
sub_progress2.done();


console.log('Is beefstreak completed?', main_progress.completed);
// output: 'false' because beef has not been bought yet
console.log(sub_progress1.uncompletedProgress);

//-----------------------------------------------------------------------------------------------
//------------------------------------EXAMPLE 2-------------------------------------------
console.log('------------------------EXAMPLE 2 -----------------------------------------')


const buy_fish = new ProgressTracker('buy-fish');

const prepare_fish = new ProgressTracker('prepare-fish', buy_fish);

const prepare_fried_oil = new ProgressTracker('prepare_fried_oil');

const fry_fish = new ProgressTracker('fry-fish', prepare_fish, prepare_fried_oil);

const make_sauce = new ProgressTracker('make-sauce');


const make_fish_dish = new ProgressTracker('make-fish-dish', fry_fish, make_sauce);

buy_fish.done();  // just only atomic ProgressTracker could do this method

prepare_fried_oil.done();

// fried-spring rolls depends on the cooking oil preparation
// but, consider in this situation, we only have 1 pan to fry
// and the pan is used to to fry fish first
// so make_fried_springRoll have to wait for the fried-fish is done and  oil is ready to fry.
const make_fried_springRoll = new ProgressTracker('make-fried-spring-rolls');

const wait_for_fish_fried = new ProgressListener('is-the-fish-fried', prepare_fried_oil, fry_fish);


wait_for_fish_fried.on('finish', () => {

    console.log('fry-fish progress done, then take the pan, reuse the oil to fry spring rolls')
    make_fried_springRoll.done();

    console.log('has fish dish been done yet?', make_fish_dish.completed);
    
    console.log('fish dish would done when', make_fish_dish.uncompletedProgress,'completed')
})

console.log('Can we fry spring rolls now?', wait_for_fish_fried.finished);


