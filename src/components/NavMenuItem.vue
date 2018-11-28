<template>
  <q-item :to="to" :class="{'router-link-active': $route.fullPath.includes(activePath)}">
    <q-tooltip v-if="mini" :delay="300" anchor="center right" self="center left" :offset="[10, 10]">
      {{label}}
    </q-tooltip>
    <q-item-side :icon="icon" :color="color"/>
    <q-item-main :label="label"/>
  </q-item>
</template>

<script>
export default {
  props:['mini', 'icon', 'label', 'to', 'activePath', 'color']
}
</script>

<style>
</style>
