import {
  PLANT,
  TRANSPLANT,
  actionEventNames,
  lifecycleEventNames
} from 'constants/plantingEvents'

import PlantEvent from './Plant'
import GenericEvent from './Generic'

export actionEventNames;
export lifecycleEventNames;
export default const eventComponents = {
    [PLANT]: PlantEvent,
    Generic: GenericEvent
}