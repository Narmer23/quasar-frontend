<template>
  <page-layout :title="$t('CALENDAR')">

    <template slot="actions">
      <q-btn color="primary" icon="mdi-calendar-plus" :label="$t('CREATE_EVENT')"/>
    </template>

    <template slot="fab">
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          round
          color="primary"
          icon="mdi-calendar-plus"
        />
      </q-page-sticky>
    </template>

    <template slot="content">
      <calendar
        :tab-labels="tabLabels"
        class="bg-white shadow-1"/>

    </template>
  </page-layout>
</template>

<script>
  import UserService from 'src/services/UserService'
  import PageLayout from 'layouts/PageLayout'
  import {Calendar} from 'quasar-calendar'


  export default {
    components: {PageLayout, Calendar},
    data() {
      return {
        tabLabels: {
          month: this.$t('MONTH'),
          week: this.$t('WEEK'),
          threeDay: this.$t('3_DAYS'),
          day: this.$t('DAY'),
          agenda: this.$t('AGENDA'),
        }
      }
    },
    async mounted() {

    },
    methods: {},
    computed: {
      user() {
        return UserService.getUser()
      }
    }

  }
</script>

<style>

</style>
