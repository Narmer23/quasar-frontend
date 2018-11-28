<template>
  <page-layout :title="$t(readOnly?'CONTACT_DETAIL':(organization.id?'MODIFY_CONTACT':'NEW_CONTACT'))" back="/contacts">

    <template slot="actions">
      <q-btn v-if="organization.id" :color="readOnly?'secondary':'negative'" flat :icon="readOnly?'mdi-pencil':'mdi-cancel'" :label="$t(readOnly?'MODIFY':'CANCEL')" @click="toggleModify()"/>
    </template>

    <template slot="fab">
      <q-btn v-if="organization.id" :color="readOnly?'secondary':'negative'" round class="fixed fahx-button-bottom-right" :icon="readOnly?'mdi-pencil':'mdi-cancel'" @click="toggleModify()"/>
    </template>

    <template slot="content">
      <q-card class="bg-white">
        <q-card-title>
          <hx-select :readonly="readOnly" :options="categoryOptions" translate-label v-model="organization.category" @input="onCategorySelect"></hx-select>
        </q-card-title>
        <q-card-separator/>
        <q-card-main>
          <div class="row" v-if="isPrivate">
            <div class="col-md-2 col-xs-12 col-sm-4">
              LOGO
            </div>
            <div class="col-md-10 col-xs-12 col-sm-8">
              <div class="row gutter-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-select :readonly="readOnly" icon="mdi-clipboard-flow" sublabel-code="TYPE" :options="organizationTypeOptions" translate-label v-model="organization.type"></hx-select>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" v-model="organization.branches[0].contacts[0].firstName" :v="$v.organization.branches.$each[0].contacts.$each[0].firstName" sublabel-code="NAME" error-label-code="NAME_IS_REQUIRED"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" v-model="organization.branches[0].contacts[0].lastName" sublabel-code="SURNAME"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-email" v-model="organization.branches[0].contacts[0].email" :v="$v.organization.branches.$each[0].contacts.$each[0].email" sublabel-code="EMAIL" error-label-code="EMAIL_NOT_VALID"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-phone" v-model="organization.branches[0].contacts[0].phone" sublabel-code="PHONE"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-cellphone" v-model="organization.branches[0].contacts[0].cellular" sublabel-code="CELLULAR"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-select :readonly="readOnly" icon="mdi-gender-male-female" sublabel-code="SEX" :options="sexOptions" translate-label v-model="organization.sex"></hx-select>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-datetime :readonly="readOnly" icon="mdi-calendar" v-model="organization.branches[0].birthDate" sublabel-code="BIRTH_DATE"></hx-datetime>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-barcode" v-model="organization.vatNumber" sublabel-code="VAT_NUMBER"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-account-card-details" v-model="organization.taxCode" sublabel-code="TAX_CODE"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-email-check" v-model="organization.pec" :v="$v.organization.pec" sublabel-code="PEC" error-label-code="EMAIL_NOT_VALID"></hx-input>
                </div>
                <div class="col-12">
                  <hx-chips-input sublabel-code="IBAN_LIST" :readonly="readOnly" v-model="organization.branches[0].ibanList" allow-copy icon="mdi-bank"></hx-chips-input>
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-else>
            <div class="col-md-2 col-xs-12 col-sm-4">
              LOGO
            </div>
            <div class="col-md-10 col-xs-12 col-sm-8">
              <div class="row gutter-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-select :readonly="readOnly" icon="mdi-clipboard-flow" sublabel-code="TYPE" :options="organizationTypeOptions" translate-label v-model="organization.type"></hx-select>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-domain" v-model="organization.name" :v="$v.organization.name" sublabel-code="ORGANIZATION_NAME" error-label-code="NAME_IS_REQUIRED"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-barcode" v-model="organization.vatNumber" sublabel-code="VAT_NUMBER"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-account-card-details" v-model="organization.taxCode" sublabel-code="TAX_CODE"></hx-input>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <hx-input :readonly="readOnly" icon="mdi-email-check" v-model="organization.pec" :v="$v.organization.pec" sublabel-code="PEC" error-label-code="EMAIL_NOT_VALID"></hx-input>
                </div>
              </div>
            </div>
          </div>
        </q-card-main>
      </q-card>

      <q-tabs v-model="selectedTab" no-pane-border class="q-mt-sm shadow-1" :two-lines="false" color="secondary" inverted>
        <q-tab icon="mdi-domain" slot="title" v-for="(branch, index) in organization.branches" :key="index+1" :name="'branch'+index" :label="branch.name"/>
        <q-btn slot="title" icon="mdi-plus" @click="addBranch" flat v-if="!readOnly"></q-btn>

        <q-tab-pane v-for="(branch, index) in organization.branches" :key="index" :name="'branch'+index" class="bg-white">
          <branch :v="$v.organization.branches.$each[index]" :read-only="readOnly" :data="branch" :is-private="isPrivate"></branch>
          <div class="row justify-center q-mt-md" v-if="!branch.mainOffice && !readOnly">
            <div>
              <q-btn icon="mdi-delete" :label="$t('DELETE_BRANCH')" @click="removeBranch(index)" color="negative"></q-btn>
            </div>
          </div>
        </q-tab-pane>

      </q-tabs>

      <q-card class="bg-white q-mt-md shadow-1" v-if="!readOnly">
        <q-card-main>
          <div class="row justify-center">
            <q-btn class="col-xs-12 col-sm-6 col-md-3" :disabled="$v.organization.$error" icon="mdi-content-save" :label="$t('SAVE')" @click="saveOrganization(organization)" color="primary"></q-btn>
          </div>
        </q-card-main>
      </q-card>
    </template>

  </page-layout>
</template>

<script>
  import OrganizationService from 'src/services/OrganizationService'
  import UserService from 'src/services/UserService'
  import PageLayout from 'layouts/PageLayout'
  import Branch from 'components/company/Branch'
  import {HxInput, HxSelect, HxChipsInput, HxAutocomplete, HxDatetime} from 'components/input'
  import {required, email} from 'vuelidate/lib/validators'
  import _ from 'lodash'
  import {extend} from 'quasar'
  import countries from 'src/statics/countries.json'

  export default {
    components: {PageLayout, Branch, HxInput, HxSelect, HxChipsInput, HxAutocomplete, HxDatetime},
    data() {
      return {
        countries,
        originalOrganization: {},
        readOnly: false,
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
        selectedTab: 'branch0',
        categories: [],
        organization: {
          type: 'CLIENT',
          category: 'AZIENDA',
          creationDate: new Date(),
          branches: [{
            name: this.$t('MAIN_BRANCH'),
            type: 'ORGANIZATION',
            mainOffice: true,
            mainShipping: true,
            contacts: [],
            ibanList: []
          }]
        }
      }
    },
    validations: {
      organization: {
        name: {required},
        pec: {email},
        branches: {
          required,
          $each: {
            name: {required},
            contacts: {
              $each: {
                lastName: {required},
                email: {email}
              }
            }
          }
        }
      }
    },
    async mounted() {
      if (this.$route.params.id) {
        this.readOnly = true;
        this.organization = await OrganizationService.getById(this.$route.params.id);
      }
      this.categories = await OrganizationService.getCategories();
      this.organization.company = this.user.company.id;
    },
    methods: {
      addBranch() {
        this.organization.branches.push({
          name: this.$t('BRANCH') + ' ' + (this.organization.branches.length + 1),
          type: 'ORGANIZATION',
          mainOffice: false,
          mainShipping: false,
          contacts: [],
          ibanList: []
        });
        this.selectedTab = 'branch' + (this.organization.branches.length - 1);
      },
      onCategorySelect() {
        if (this.isPrivate && !this.organization.branches[0].contacts.length) {
          this.organization.branches[0].contacts.push({});
        }
      },
      removeBranch(index) {
        if (this.organization.branches[index].mainShipping)
          this.organization.branches[index - 1].mainShipping = true;
        this.organization.branches.splice(index, 1);
        this.selectedTab = 'branch' + (index - 1);

      },
      async saveOrganization(organization) {
        if (this.isPrivate) {
          this.organization.name = this.organization.branches[0].contacts[0].lastName + " " + this.organization.branches[0].contacts[0].firstName
          this.organization.branches[0].email = this.organization.branches[0].contacts[0].email
          this.organization.branches[0].phone = this.organization.branches[0].contacts[0].phone;
          this.organization.branches[0].cellular = this.organization.branches[0].contacts[0].cellular;
        }
        this.$v.organization.$touch();
        if (!this.$v.organization.$error) {
          if (this.organization.id) {
            await OrganizationService.modifyOrganization(organization);
            this.$q.notify({icon: 'mdi-check', color: 'positive', message: this.$t('REGISTRY_MODIFIED')})
          } else {
            await OrganizationService.createOrganization(organization);
            this.$q.notify({icon: 'mdi-check', color: 'positive', message: this.$t('REGISTRY_CREATED')})
          }

          this.readOnly = true;
        } else {
          this.$q.notify({icon: 'mdi-alert', color: 'negative', message: this.$t('CHECK_INSERTED_DATA')})
        }
      },
      toggleModify() {
        if (this.readOnly) {
          extend(true, this.originalOrganization, this.organization);
          this.readOnly = false;
        } else {
          if (!_.isEqual(this.originalOrganization, this.organization)) {
            this.$q.dialog({
              title: this.$t('CANCEL_EDIT_QUESTION'),
              message: this.$t('CANCEL_EDIT_MESSAGE'),
              ok: this.$t('YES'),
              cancel: this.$t('NO')
            }).then(() => {
              this.readOnly = true;
              this.organization = this.originalOrganization;
              this.originalOrganization = {};
              this.selectedTab = 'branch0';
              this.$q.notify({icon: 'mdi-information', color: 'secondary', message: this.$t('EDIT_CANCELED')})
            })

          } else {
            this.readOnly = true;
          }
        }
      }
    },
    computed: {
      user() {
        return UserService.getUser()
      },
      categoryOptions() {
        return this.categories.map(c => {
          return {label: this.$t(c), value: c}
        })
      },
      organizationTypeOptions() {
        return [{label: this.$t('CLIENT'), value: 'CLIENT'}, {label: this.$t('SUPPLIER'), value: 'SUPPLIER'}]
      },
      formattedCountries() {
        return countries.map(c => {
          return {value: c.name, label: this.$t(c.name)}
        })
      },
      isPrivate() {
        return this.organization.category === 'PRIVATO'
      }
    }
  }
</script>

<style lang="stylus">

</style>
