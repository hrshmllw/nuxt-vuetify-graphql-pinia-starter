<template>
	<v-container>
		<h3 class="my-5">SpaceX Mission List</h3>
		<v-select v-model="selectedYear" :items="availableYears" clearable label="Filter by Year" />
		<v-btn class="mb-3" color="primary" @click="toggleSortDirection">
			{{ sortDirection === 'asc' ? 'Ascending' : 'Descending' }}
		</v-btn>
		<v-btn class="mb-3 ml-2" to="/favorites">View Favorites</v-btn>

		<p>There are {{ filteredLaunches.length || 0 }} missions.</p>

		<v-table>
			<thead>
				<tr>
					<th class="text-center">Mission Name</th>
					<th class="text-center">Launch Date</th>
					<th class="text-center">Site</th>
					<th class="text-center w-25">Rocket Name</th>
					<th class="text-center">Details</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="launch in sortedLaunches" :key="(launch.mission_name as string)">
					<td class="text-center">{{ launch.mission_name }}</td>
					<td class="text-center">{{ launch.launch_date_utc }}</td>
					<td class="text-center">
						{{ launch.launch_site ? launch.launch_site.site_name : 'N/A' }}
					</td>
					<td class="text-center">
						{{ launch.rocket ? launch.rocket.rocket_name : 'N/A' }}
						<v-icon
							:color="isFavorite(launch.rocket?.rocket_name) ? 'yellow' : ''"
							@click="toggleFavorite(launch.rocket?.rocket_name)"
						>
							{{ isFavorite(launch.rocket?.rocket_name) ? 'mdi-star' : 'mdi-star-outline' }}
						</v-icon>
					</td>
					<td class="text-center">{{ launch.details ? launch.details : 'N/A' }}</td>
				</tr>
			</tbody>
		</v-table>
	</v-container>
</template>

<script lang="ts">
import useLaunchesFilter from '@/composables/useLaunchesFilter'
import useLaunchesSort from '@/composables/useLaunchesSort'
import { useFavoritesStore } from '@/stores/useFavoritesStore'

export default {
	setup() {
		interface Launch {
			mission_name: string
			launch_date_utc: Date
			launch_site: {
				site_name: string
			}
			rocket: {
				rocket_name: string
			}
			details: string
		}

		const { data } = useAsyncQuery<{ launches: Launch[] }>(gql`
			query getLaunches {
				launches {
					id
					mission_name
					launch_date_utc
					launch_site {
						site_name
					}
					rocket {
						rocket_name
					}
					details
				}
			}
		`)

		const launches = ref<Launch[]>([])

		const { selectedYear, filteredLaunches } = useLaunchesFilter(launches)

		const { sortDirection, sortedLaunches, toggleSortDirection } = useLaunchesSort(filteredLaunches)

		launches.value = data?.value?.launches ?? []

		const availableYears = computed(() => {
			const years = new Set<string>()
			launches.value.forEach((launch) => {
				const launchYear = new Date(launch.launch_date_utc).getFullYear().toString()
				years.add(launchYear)
			})
			return Array.from(years)
		})

		const favoriteStore = useFavoritesStore()
		const isFavorite = (rocketName: string) => favoriteStore.getFavoriteRockets.includes(rocketName)

		const toggleFavorite = (rocketName: string) => {
			if (isFavorite(rocketName)) {
				favoriteStore.removeFavoriteRocket(rocketName)
			} else {
				favoriteStore.addFavoriteRocket(rocketName)
			}
		}
		return {
			selectedYear,
			filteredLaunches,
			availableYears,
			sortDirection,
			sortedLaunches,
			toggleSortDirection,
			isFavorite,
			toggleFavorite,
		}
	},
}
</script>
