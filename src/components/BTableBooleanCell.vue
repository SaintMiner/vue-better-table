<template>
	<div class="text-center">
		<fa
			v-if="value"
			icon="check"
			size="sm"
			class="w-2.5 h-2.5 bg-green-500 p-1 rounded text-white"
		/>
		<fa
			v-else
			icon="minus"
			size="sm"
			class="w-2.5 h-2.5 bg-red-500 p-1 rounded text-white"
		/>
	</div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faMinus, faCheck } from "@fortawesome/free-solid-svg-icons";

library.add(faMinus, faCheck);

export default {
	name: "BTableBooleanCell",

	components: {
		fa: FontAwesomeIcon,
	},

	props: {
		value: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style></style>
