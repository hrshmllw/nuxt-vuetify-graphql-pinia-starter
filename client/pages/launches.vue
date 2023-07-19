<template>
	<v-container>
		<h3 class="my-5">SpaceX Mission List</h3>
		<v-select v-model="selectedYear" :items="availableYears" clearable label="Filter by Year" />

		<v-btn class="mb-3" @click="toggleSortDirection">
			{{ sortDirection === 'asc' ? 'Ascending' : 'Descending' }}
		</v-btn>

		<p>There are {{ filteredLaunches.length || 0 }} missions.</p>

		<v-table>
			<thead>
				<tr>
					<th class="text-left">Mission Name</th>
					<th class="text-left">Launch Date</th>
					<th class="text-left">Launch Site</th>
					<th class="text-left">Rocket Name</th>
					<th class="text-left">Details</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="launch in sortedLaunches" :key="(launch.mission_name as string)">
					<td>{{ launch.mission_name }}</td>
					<td>{{ launch.launch_date_utc }}</td>
					<td>{{ launch.launch_site ? launch.launch_site.site_name : 'N/A' }}</td>
					<td>{{ launch.rocket ? launch.rocket.rocket_name : 'N/A' }}</td>
					<td>{{ launch.details ? launch.details : 'N/A' }}</td>
				</tr>
			</tbody>
		</v-table>
	</v-container>
</template>

<script lang="ts">
import useLaunchesFilter from '@/composables/useLaunchesFilter'
import useLaunchesSort from '@/composables/useLaunchesSort'

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

		return {
			selectedYear,
			filteredLaunches,
			availableYears,
			sortDirection,
			sortedLaunches,
			toggleSortDirection,
		}
	},
}
</script>
