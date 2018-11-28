<template>
  <q-page>

    <q-card flat class="bg-white absolute full-width" text-color="dark">
      <q-card-title>

        <div class="row justify-between">
          <div class="q-headline row no-wrap">
            <q-btn class="q-mr-sm" v-show="back" v-go-back="back" flat dense icon="mdi-chevron-left"></q-btn>
            <div class="q-mt-xs text-no-wrap">{{title}}</div>
          </div>
          <div class="gt-sm">
            <slot name="actions"></slot>
          </div>
        </div>

      </q-card-title>

    </q-card>


    <div class="q-pa-md content-padding">
      <slot name="content"></slot>
    </div>
    <div class="lt-sm">
      <slot name="fab"></slot>
    </div>


  </q-page>
</template>
<script>
  export default {
    props: ['title', 'back']
  }

</script>
<style>
  .content-padding {
    padding-top: 90px
  }
</style>
