const {ProgressTracker, ProgressState} = require('./progressTracker.js');



const sub_progress1_2_1 = new ProgressTracker('buy-beef')

const sub_progress1_2 = new ProgressTracker('slice-beef', sub_progress1_2_1);

const sub_progress1 = new ProgressTracker('prepare-beef', sub_progress1_2);


const sub_progress2 = new ProgressTracker('make-sauce');

const main_progress = new ProgressTracker('make-beefsteak', sub_progress1, sub_progress2);

sub_progress1.done();
sub_progress2.done();

console.log(main_progress.completed);
// output: false because beef has not been bought yet
console.log(sub_progress1.uncompletedProgress);

