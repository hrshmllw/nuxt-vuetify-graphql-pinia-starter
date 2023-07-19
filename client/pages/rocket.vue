<template>
	<v-container>
		<h3 class="my-5">Rockets</h3>
		<div class="d-flex flex-column justify-center mx-auto w-50">
			<div class="my-3">
				<v-select
					v-model="selectedRocket"
					:items="rocketNames"
					clearable
					label="Select a Rocket"
					dense
				/>
			</div>
			<div>
				<template v-if="selectedRocket">
					<v-row>
						<v-col v-for="rocket in filteredRockets" :key="rocket.name">
							<v-card>
								<v-card-title>{{ rocket.name }}</v-card-title>
								<v-card-text>
									<div>
										<strong>Description:</strong>
										{{ rocket.description || 'N/A' }}
									</div>
									<div>
										<strong>First Flight:</strong>
										{{ rocket.first_flight || 'N/A' }}
									</div>
									<div>
										<strong>Height:</strong>
										{{ rocket.height?.meters || 'N/A' }} meters ({{
											rocket.height?.feet || 'N/A'
										}}
										feet)
									</div>
									<div>
										<strong>Diameter:</strong>
										{{ rocket.diameter?.meters || 'N/A' }} meters ({{
											rocket.diameter?.feet || 'N/A'
										}}
										feet)
									</div>
									<div>
										<strong>Mass:</strong>
										{{ rocket.mass?.kg || 'N/A' }} kilograms ({{
											rocket.mass?.lb || 'N/A'
										}}
										pounds)
									</div>
									<div>
										<strong>Number of Stages:</strong>
										{{ rocket.stages || 'N/A' }}
									</div>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</template>
				<template v-else>
					<div class="d-flex justify-center mx-auto">
						<p>Select a rocket from the dropdown to view its details.</p>
					</div>
				</template>
			</div>
		</div>
	</v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

interface Rocket {
	name: string
	description: string
	first_flight: string
	height: {
		meters: number
		feet: number
	}
	diameter: {
		meters: number
		feet: number
	}
	mass: {
		kg: number
		lb: number
	}
	stages: number
}

const { data } = useAsyncQuery<{ rockets: Rocket[] }>(gql`
	query getRockets {
		rockets {
			name
			description
			first_flight
			height {
				meters
				feet
			}
			diameter {
				meters
				feet
			}
			mass {
				kg
				lb
			}
			stages
		}
	}
`)

const rockets = ref<Rocket[]>(data.value?.rockets ?? [])
const selectedRocket = ref<string | null>(null)

const filteredRockets = computed(() => {
	if (!selectedRocket.value) {
		return rockets.value
	}
	return rockets.value.filter((rocket) => rocket.name === selectedRocket.value)
})

const rocketNames = computed(() => rockets.value.map((rocket) => rocket.name))
</script>
