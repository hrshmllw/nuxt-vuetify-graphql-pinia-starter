<template>
	<v-app>
		<v-app-bar color="primary">
			<template #prepend>
				<v-icon icon="mdi-nuxt" />
			</template>
			<v-app-bar-title>Nuxt 3-Vuetify-GraphQL-Pinia Starter</v-app-bar-title>
			<template #append>
				<v-btn to="/">HOME</v-btn>
				<v-btn to="/launches">LAUNCHES</v-btn>
				<v-btn to="/rocket">ROCKETS</v-btn>
			</template>
		</v-app-bar>
		<v-main>
			<slot />
		</v-main>
		<v-footer class="bg-grey-lighten-1" app>
			<div class="text-center w-100">
				{{ new Date().getFullYear() }} -
				<strong>Nuxt3-Vuetify-GraphQL-Pinia Starter</strong>
			</div>
		</v-footer>
	</v-app>
</template>
<script>
export default {
	name: 'DefaultLayout',
}
</script>
