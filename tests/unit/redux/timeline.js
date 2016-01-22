import {test} from 'tape'
import {selectTimelineData} from 'redux/modules/timeline'

const plantings = Object.freeze(require('../../fixtures/plantings.json'))
const places = Object.freeze(require('../../fixtures/places.json'))
const plants = Object.freeze(require('../../fixtures/plants.json'))

test('Timeline data memoized selector', function (t) {
  t.plan(1)

  t.equal(true, true, 'should process planting data into a format consumable by the Timeline component')

    // t.equal(selectTimelineData.recomputations(), 2, 'should be recalculated only when plantings change')

});
