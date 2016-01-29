import GenericEvent from './Generic'
import PlantEvent from './Plant'
import TransplantEvent from './Transplant'
import {
	PLANT,
	TRANSPLANT,
	actionEventNames,
	lifecycleEventNames
} from 'constants/plantingEvents'

export actionEventNames;
export lifecycleEventNames;

export default const eventComponents = {
	  [PLANT]: PlantEvent,
	  [TRANSPLANT]: TransplantEvent
}