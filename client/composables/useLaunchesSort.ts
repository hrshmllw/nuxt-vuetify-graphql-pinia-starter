interface Launch {
	mission_name: String
	launch_date_utc: Date
	launch_site: {
		site_name: String
	}
	rocket: {
		rocket_name: String
	}
	details: String
}

export default function useLaunchesSort(launches: Ref<Launch[]>) {
	const sortDirection = ref<'asc' | 'desc'>('asc')

	const sortedLaunches = computed(() => {
		const sorted = [...launches.value]
		const multiplier = sortDirection.value === 'asc' ? 1 : -1
		sorted.sort((a, b) => {
			const dateA = new Date(a.launch_date_utc).getTime()
			const dateB = new Date(b.launch_date_utc).getTime()
			return (dateA - dateB) * multiplier
		})
		return sorted
	})

	function toggleSortDirection() {
		sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
	}

	return {
		sortDirection,
		sortedLaunches,
		toggleSortDirection,
	}
}
