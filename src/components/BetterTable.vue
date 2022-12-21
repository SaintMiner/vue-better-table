<template>
	<div class="bg-white border rounded pt-4">
		<div class="w-1/2" v-if="searchable">
			<input
				v-model="search"
				type="text"
				class="w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-200 focus:outline-none"
				placeholder="Search"
			/>
		</div>

		<div>
			<table class="w-full border-collapse table-auto text-sm">
				<thead>
					<tr>
						<th
							v-if="selectable"
							class="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-600 dark:text-slate-200 text-left"
						>
							<input
								type="checkbox"
								class="rounded text-blue-400 border-blue-300 focus:ring-blue-200 disabled:border-slate-200 disabled:cursor-not-allowed"
								:checked="selectedRows.length === selectableRows.length"
								@click="toggleSelectAll"
							/>
						</th>

						<th
							v-for="column in columns"
							:key="column.name"
							class="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-600 dark:text-slate-200 text-left"
						>
							{{ column.label }}
						</th>
					</tr>
				</thead>

				<tbody>
					<tr
						v-for="(row, index) in paginatedRows"
						:key="row[keyColumn]"
						@click="rowClick(row, index)"
						class="hover:bg-gray-200"
					>
						<td class="p-4 pl-8 w-0" v-if="selectable">
							<input
								type="checkbox"
								class="rounded text-blue-400 border-blue-300 focus:ring-blue-200 disabled:border-slate-200 disabled:cursor-not-allowed"
								:value="objectsSelect ? row : row[keyColumn]"
								:disabled="
									objectsSelect
										? Object.keys(row).length === 0
										: !row[keyColumn]
								"
								v-model="selectedRows"
							/>
						</td>

						<td
							v-for="column in columns"
							:key="column.name"
							class="p-4 pl-8 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400"
						>
							<slot
								:name="column.name"
								:value="row[column.name]"
								:row="row"
								:index="index"
							>
								{{ row[column.name] ?? column.default }}
							</slot>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="p-4 pl-8 flex justify-between">
				<div class="text-xs">{{ data?.length ?? 0 }} items</div>

				<div class="flex" v-if="pagination">
					<button
						@click="prevPage"
						:disabled="this.page === 1"
						data-tooltip-target="default-button-example-mobile-tooltip"
						class="disabled:opacity-50 m-1 flex items-center p-1 text-xs font-medium text-gray-700 bg-white rounded-lg toggle-mobile-view enabled:hover:text-blue-700"
					>
						<fa icon="chevron-left" class="w-3 h-3" size="xs" />
						<span> Prev </span>
					</button>

					<div class="text-xs m-auto mx-3">
						{{ this.page }} / {{ this.pageCount }}
					</div>

					<button
						@click="nextPage"
						:disabled="this.page === this.pageCount"
						data-tooltip-target="default-button-example-mobile-tooltip"
						class="disabled:opacity-50 m-1 flex items-center p-1 text-xs font-medium text-gray-700 bg-white rounded-lg toggle-mobile-view enabled:hover:text-blue-700"
					>
						<span> Next </span>
						<fa icon="chevron-right" class="w-3 h-3" size="xs" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "BetterTable",

	emits: ["rowClick", "update:modelValue"],

	data() {
		return {
			page: 1,
			selectedRows: [],
			search: null,
		};
	},

	props: {
		modelValue: {
			type: Array,
			required: false,
			default: [],
		},

		pagination: {
			type: Boolean,
			required: false,
		},
		paginationLimit: {
			type: Number,
			default: 5,
			required: false,
		},

		structure: {
			type: Array,
		},
		data: {
			type: Array,
			required: true,
		},
		keyColumn: {
			type: String,
			default: "id",
			required: false,
		},

		searchable: {
			type: Boolean,
			required: false,
		},
		dataRowNum: {
			type: Boolean,
			required: false,
		},
		selectable: {
			type: Boolean,
			required: false,
		},
		objectsSelect: {
			type: Boolean,
			required: false,
		},
	},

	computed: {
		selectableRows() {
			return this.rows.filter((row) => {
				return this.objectsSelect
					? Object.keys(row).length === 0
					: row[this.keyColumn];
			});
		},

		columns() {
			let columns = this.structure ?? [];
			if (this.dataRowNum) {
				columns = [
					{
						name: "data_row_num",
						label: "#",
					},
				].concat(columns);
			}
			return columns;
		},

		paginatedRows() {
			let rows = this.rows;

			if (this.pagination && this.paginationLimit > 0) {
				rows = rows.slice(
					this.paginationLimit * (this.page - 1),
					this.paginationLimit * this.page
				);
			}

			return rows;
		},

		rows() {
			let rows = this.data ?? [];
			if (this.dataRowNum) {
				rows = rows.map((row, index) => {
					row.data_row_num = index + 1;
					return row;
				});
			}

			if (this.search) {
				rows = rows.filter((row) => {
					const searchable_keys = this.columns
						.filter((column) => column.searchable)
						.map((column) => column.name);
					const row_values = [];
					searchable_keys.forEach((key) => {
						if (row[key]) {
							row_values.push(row[key]);
						}
					});
					return row_values.some((value) => {
						return value.toLowerCase().includes(this.search.toLowerCase());
					});
				});
			}

			return rows;
		},

		pageCount() {
			return Math.ceil(this.rows.length / this.paginationLimit);
		},
	},

	watch: {
		selectedRows: {
			deep: true,
			handler(value) {
				this.$emit("update:modelValue", value);
			},
		},
	},

	methods: {
		nextPage() {
			if (this.page < this.pageCount) {
				this.page++;
			}
		},

		prevPage() {
			if (this.page > 1) this.page--;
		},

		toggleSelectAll() {
			const isSelected =
				this.selectableRows.length === this.selectedRows.length;
			if (isSelected) {
				this.selectedRows = [];
			} else {
				this.selectedRows = this.objectsSelect
					? this.selectableRows
					: this.selectableRows.map((row) => row[this.keyColumn]);
			}
		},

		rowClick(row, index) {
			this.$emit("rowClick", row, index);
		},
	},

	mounted() {
		this.selectedRows = this.modelValue;
	},
};
</script>

<style></style>
