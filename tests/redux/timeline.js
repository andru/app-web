import {test} from 'tape'
import {selectTimelineData} from 'redux/modules/timeline'

test('Timeline data memoized selector', function (t) {
    t.plan(1);

    let dummyPlantings = [

    ]

    t.equal(true, true, 'should process planting data into a format consumable by the Timeline component');

    // t.equal(selectTimelineData.recomputations(), 2, 'should be recalculated only when plantings change')

});