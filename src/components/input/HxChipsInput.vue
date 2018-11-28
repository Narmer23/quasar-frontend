<template>
  <div>
    <q-item v-show="readonly" class="no-padding">
      <q-item-side v-if="icon" :icon="icon"></q-item-side>
      <q-item-main>
        <q-item-tile sublabel class="q-caption">{{$t(sublabelCode)}}</q-item-tile>

        <q-item-tile label>
          <q-btn v-if="allowCopy" class="q-mr-xs" v-clipboard:copy='val' v-clipboard:success='onCopy' v-clipboard:error='onError' :key="index" v-for="(val, index) in value" outline dense color="dark" icon="mdi-content-copy" :label="val">
            <q-tooltip :delay="300" anchor="bottom middle" self="top middle" :offset="[10, 10]">
              <div class="q-caption">{{$t('COPY')}}</div>
            </q-tooltip>
          </q-btn>
          <q-chip v-else class="q-mr-xs" :key="index" v-for="(val, index) in value" tect-color="black" color="light">{{val}}</q-chip>
        </q-item-tile>
      </q-item-main>
    </q-item>
    <q-field v-show="!readonly"
             :icon="icon"
             :error="v.$error"
             :error-label="$t(errorLabelCode)">
      <q-chips-input chips-bg-color="light" chips-color="black" :value="value" @blur="blur" @input="update" :color="color" :stack-label="$t(sublabelCode)"/>
    </q-field>
  </div>
</template>

<script>
  export default {
    props: {
      allowCopy: {
        default: false,
        type: Boolean
      },
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
        type: Array
      },
      v: {
        default: () => {
          return {$error: false, $touch: void(0)}
        },
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
        if (this.v.$touch)
          this.v.$touch();
      },
      onCopy() {
        this.$q.notify({message: this.$t('ELEMENT_COPIED'), icon: 'mdi-content-copy', color: 'secondary'})
      },
      onError() {
        this.$q.notify({message: this.$t('COULD_NOT_COPY'), icon: 'mdi-alert', color: 'negative'})
      }
    }
  }
</script>
