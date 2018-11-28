<template>
  <div>
    <q-item v-show="readonly" class="no-padding">
      <q-item-side v-if="icon" :icon="icon"></q-item-side>
      <q-item-main>
        <q-item-tile sublabel class="q-caption">{{$t(sublabelCode)}}</q-item-tile>
        <q-item-tile label class="text-justify">{{value?(translateLabel?$t(value):value):'-'}}</q-item-tile>
      </q-item-main>
    </q-item>
    <q-field v-show="!readonly"
             :icon="icon"
             :error="v.$error"
             :error-label="$t(errorLabelCode)">
      <q-input type="textarea" :max-height="100" rows="2" :color="color" :stack-label="$t(sublabelCode)" :value="value" @blur="blur" @input="update"/>
    </q-field>
  </div>
</template>

<script>
  export default {
    props: {
      readonly: {
        default: true,
        type: Boolean
      },
      translateLabel: {
        default: false,
        type: Boolean
      },
      icon: {
        default: null,
        type: String
      },
      color: {
        default: 'primary',
        type: String
      },
      value: {
        type: String
      },
      v: {
        default: ()=>{return {$error: false, $touch: void(0)}},
        type: Object
      },
      errorLabelCode: {
        default: '',
        type: String
      },
      sublabelCode: {
        default: '',
        type: String
      }
    },
    methods: {
      update(event) {
        this.$emit('input', event)
      },
      blur(event) {
        this.$emit('blur', event)
        if(this.v.$touch)
          this.v.$touch();
      }
    }
  }
</script>
