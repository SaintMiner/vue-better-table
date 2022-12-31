<template>
  <div class="h-full flex items-center bg-gray-100">
    <div class="container mx-auto w-2/4">      
      <BetterTable 
        v-model="selected"
        name="Better table"
        :structure="structure" 
        :data="tableData"      
        :data-row-num="true"
        selectable
        pagination
        :searchable="true"
        :paginationLimit="4"
        :objects-select="false"
        @rowClick="testRowClick"
      >
        <template v-slot:name="{ value, index }">
          My name is {{ value }} i'm at {{ index }} index
        </template>
      </BetterTable>
    </div>
  </div>
</template>

<script>
import { BetterTable } from "./components";
import structure from './json/table-structure.json';
import tableData from './json/table-data.json';

export default {
	name: "App",

  data() {
    return {
      selected: [],
      structure,
      tableData
    }
  },

	components: {
		BetterTable,
	},

  methods: {
    testRowClick(row, index) {
      console.log('testRowClick row:', row);
      console.log('testRowClick index:', index);
    }
  }
};
</script>

<style></style>
