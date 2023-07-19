<template>
	<v-container>
		<v-btn to="/launches">
			<v-icon start icon="mdi-arrow-left" />
			BACK
		</v-btn>
		<h3 class="my-5">Favorite Rockets</h3>

		<v-row>
			<v-col v-for="rocket in favoriteRockets" :key="rocket" cols="12" md="6" lg="4">
				<v-card>
					<v-card-title>{{ rocket }}</v-card-title>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useFavoritesStore } from '@/stores/useFavoritesStore'

export default defineComponent({
	setup() {
		const favoriteStore = useFavoritesStore()
		const favoriteRockets = favoriteStore.getFavoriteRockets

		return {
			favoriteRockets,
		}
	},
})
</script>
