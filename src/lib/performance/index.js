import { getNormalNavigationTiming, getAdvancedNavigationTiming } from './navigation'
export { getAllResourceTiming } from './resource'
export { onLongTask } from './longTask'
export { getStatistics } from './statistics'

export async function getNavigationTiming () {
  return { ...getNormalNavigationTiming(), ...await getAdvancedNavigationTiming() }
}
