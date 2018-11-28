<template>
  <q-modal v-model="opened" @hide="close" :content-css="{maxWidth: '767px', minHeight: '30vh'}">
    <q-modal-layout>
      <q-toolbar slot="header" color="secondary">
        <q-toolbar-title>
          {{$t(isEdit ? 'MODIFY_CONTACT' : 'NEW_CONTACT')}}
        </q-toolbar-title>
      </q-toolbar>

      <q-toolbar slot="footer" color="secondary" inverted>
        <q-toolbar-title></q-toolbar-title>
        <q-btn flat :label="$t('CANCEL')" @click="opened=false" color="dark"></q-btn>
        <q-btn :disabled="$v.contact.$error" flat icon="mdi-content-save" :label="$t(isEdit?'MODIFY':'SAVE')"
               @click="saveContact(contact)"></q-btn>
      </q-toolbar>

      <q-list no-border class="q-mb-md">
        <q-item>
          <q-item-side>
            <q-item-tile avatar>
              <img src="statics/no_avatar.png"/>
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <div class="row gutter-sm items-center">
              <q-field
                :error="$v.contact.firstName.$error"
                :error-label="$t('NAME_REQUIRED')"
                class="col-6">
                <q-input color="secondary" type="text" v-model="contact.firstName"
                         :float-label="$t('NAME')"></q-input>
              </q-field>
              <q-field
                :error="$v.contact.lastName.$error"
                :error-label="$t('NAME_REQUIRED')"
                class="col-6">
                <q-input color="secondary" type="text" v-model="contact.lastName"
                         :float-label="$t('SURNAME')"></q-input>
              </q-field>
            </div>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side class="text-center">
            <q-item-tile icon="mdi-contact-mail"></q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-field
              :error="$v.contact.email.$error"
              :error-label="$t('EMAIL_NOT_VALID')">
              <q-input color="secondary" type="text" v-model="contact.email" :float-label="$t('EMAIL')" @blur="$v.contact.email.$touch()"></q-input>
            </q-field>
          </q-item-main>
        </q-item>

        <q-item>
          <q-item-side class="text-center">
            <q-item-tile icon="mdi-phone"></q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-field
              :error="$v.contact.phone.$error"
              :error-label="$t('NAME_REQUIRED')">
              <q-input color="secondary" type="text" v-model="contact.phone" :float-label="$t('PHONE')"></q-input>
            </q-field>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side class="text-center">
            <q-item-tile icon="mdi-domain"></q-item-tile>
          </q-item-side>
          <q-item-main>
            <div class="row gutter-sm">
              <div class="col-6">
                <q-field
                  :error="$v.contact.role.$error"
                  :error-label="$t('NAME_REQUIRED')">
                  <q-select color="secondary" v-model="contact.role" :options="rolesOptions" :float-label="$t('ROLE')"/>
                </q-field>
              </div>
              <div class="col-6">
                <q-field>
                  <q-select color="secondary" v-model="contact.sex" :options="sexOptions" :float-label="$t('SEX')"/>
                </q-field>
              </div>
            </div>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side class="text-center">
            <q-item-tile icon="mdi-calendar"></q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-field
              :error="$v.contact.birthDate.$error"
              :error-label="$t('NAME_REQUIRED')">
              <q-datetime :float-label="$t('BIRTH_DATE')" color="secondary" format-model="number" type="date"
                          v-model="contact.birthDate"/>
            </q-field>
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side class="text-center">
            <q-item-tile icon="mdi-pencil"></q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-field>
              <q-input type="textarea" rows="2" color="secondary" v-model="contact.notes"
                       :float-label="$t('NOTES')"></q-input>
            </q-field>
          </q-item-main>
        </q-item>
      </q-list>
    </q-modal-layout>
  </q-modal>
</template>

<script>
  import {required, email} from 'vuelidate/lib/validators'
  import OrganizationService from 'src/services/OrganizationService'
  import _ from 'lodash'

  export default {
    props: ['contact', 'value', 'isEdit', 'readOnly'],
    data() {
      return {
        roles: [],
        opened: false,
        sexOptions: [
          {
            label: this.$t('MALE'),
            value: 'MALE'
          },
          {
            label: this.$t('FEMALE'),
            value: 'FEMALE'
          },
          {
            label: this.$t('OTHER'),
            value: 'OTHER'
          }
        ],
        edit: false
      }
    },
    async mounted() {
      this.roles = await OrganizationService.getRoles();
    },
    methods: {
      close() {
        this.$emit('input', false);
      },
      saveContact() {
        this.$v.contact.$touch();
        if(!this.$v.contact.$error) {
          this.$emit('save', this.contact)
          this.opened = false;
        }
      }
    },
    watch: {
      value() {
        this.opened = this.value
      }
    },
    computed: {
      rolesOptions() {
        return this.roles.map(c => {
          return {label: this.$t(c), value: c}
        })
      }
    },
    validations: {
      contact: {
        firstName: {required},
        lastName: {},
        birthDate: {},
        role: {},
        sex: {},
        phone: {},
        email: {email}
      }
    }
  }
</script>

<style>
</style>
