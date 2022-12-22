<template>
  <div class="text-center">
    <fa v-if="value" icon="check" size="sm" class="w-2.5 h-2.5 bg-green-500 p-1 rounded text-white"/>
    <fa v-else icon="minus" size="sm" class="w-2.5 h-2.5 bg-red-500 p-1 rounded text-white"/>
  </div>
</template>

<script>
export default {
  name: "BTableBooleanCell",

  props: {
    value: {
      type: Boolean,
      default: false,
    }   
  }
}
</script>

<style>

</style>