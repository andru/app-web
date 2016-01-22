import GenericEvent from './Generic'
import PlantEvent from './Plant'
import TransplantEvent from './Transplant'

const PLANT = 'plant'
const TRANSPLANT = 'transplant'
const HARVEST = 'harvest'
const PLANTOUT = 'plantOut'
const POTON = 'potOn'
const FERTILIZE = 'fertilize'

const GERMINATE = 'germinate'
const LEAF = 'leaf'
const FLOWER = 'flower'
const FRUIT = 'fruit'
const DEATH = 'death'
const DIEBACK = 'dieBack'

export const eventComponents = {
	  [PLANT]: PlantEvent,
	  [TRANSPLANT]: TransplantEvent
}

export const actionEventNames = [
	  PLANT,
	  TRANSPLANT,
	  HARVEST,
	  PLANTOUT,
	  POTON,
	  FERTILIZE
]

export const lifecycleEventNames = [
	  GERMINATE,
	  LEAF,
	  FLOWER,
	  FRUIT,
	  DEATH,
	  DIEBACK
]
