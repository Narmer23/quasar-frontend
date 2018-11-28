<template>
  <div>
    <q-list no-border link inset-separator>
      <img class="q-ml-sm" v-if="!isMini" height="50" src="statics/quasar_logo.svg"/>
      <nav-menu-item v-for="item in menuItems" :key="item.to" :to="item.to" :color="item.color||'grey-9'" :icon="item.icon" :label="item.label" :mini="isMini" :active-path="item.activePath||item.to"/>
    </q-list>
  </div>
</template>
<script>
  import NavMenuItem from 'components/NavMenuItem'

  export default {
    data() {
      return {
        menuItems: [
          {
            to: '/dashboard',
            icon: 'mdi-home',
            label: this.$t('HOME'),
            color: 'primary'
          },
          {
            to: '/contacts',
            icon: 'mdi-contacts',
            label: this.$t('CONTACTS'),
            activePath:'/contacts'
          },
          {
            to: '/calendar',
            icon: 'mdi-calendar-today',
            label: this.$t('CALENDAR')
          }
        ]
      }
    },
    props: ['isMini'],
    components: {NavMenuItem}
  };
</script>
<style>

</style>


