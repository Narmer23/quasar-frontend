<template>
  <div>
    <div class="row gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <hx-input :readonly="readOnly" icon="mdi-home" v-model="data.name" :v="v.name" sublabel-code="NAME" error-label-code="NAME_IS_REQUIRED"></hx-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <hx-input :readonly="readOnly" icon="mdi-map-marker" v-model="data.address" :v="v.address" sublabel-code="ADDRESS" error-label-code="ADDRESS_IS_REQUIRED"></hx-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <hx-input :readonly="readOnly" icon="mdi-city" v-model="data.city" sublabel-code="CITY"></hx-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <hx-input :readonly="readOnly" icon="mdi-mailbox" v-model="data.cap" sublabel-code="CAP"></hx-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <hx-input :readonly="readOnly" icon="mdi-map-marker-radius" v-model="data.province" sublabel-code="PROVINCE"></hx-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <hx-autocomplete :readonly="readOnly" icon="mdi-earth" v-model="data.nation" sublabel-code="COUNTRY" :static-data="{field:'value', list: formattedCountries}"></hx-autocomplete>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3" v-if="!isPrivate">
        <hx-input :readonly="readOnly" icon="mdi-email" v-model="data.email" :v="v.email" sublabel-code="EMAIL" error-label-code="EMAIL_NOT_VALID"></hx-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3" v-if="!isPrivate">
        <hx-input :readonly="readOnly" icon="mdi-phone" v-model="data.phone" sublabel-code="PHONE"></hx-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3" v-if="!isPrivate">
        <hx-input :readonly="readOnly" icon="mdi-cellphone" v-model="data.cellular" sublabel-code="CELLULAR"></hx-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <hx-input :readonly="readOnly" icon="mdi-web" v-model="data.website" sublabel-code="WEBSITE"></hx-input>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3">
        <q-field>
          <q-checkbox :readonly="readOnly" :label="$t('MAIN_SHIPPING')" v-model="data.mainShipping"/>
        </q-field>
        <q-field>
          <q-checkbox :readonly="readOnly" :label="$t('MAIN_BILLING')" v-model="data.mainOffice"/>
        </q-field>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6">
        <hx-textarea :readonly="readOnly" icon="mdi-pencil" v-model="data.notes" sublabel-code="NOTES"></hx-textarea>
      </div>

    <div class="col-12" v-if="!isPrivate">
      <hx-chips-input sublabel-code="IBAN_LIST" :readonly="readOnly" v-model="data.ibanList" allow-copy icon="mdi-bank"></hx-chips-input>
    </div>

    <div class="col-12" v-if="!isPrivate">
      <q-table
        :title="$tc('BRANCH_EMPLOYEE', 2, {branch: data.name})"
        :data="data.contacts"
        :columns="contactColumns"
        :visible-columns="visibleColumns"
        :no-data-label="$tc('EMPLOYEE', 0)"
        :rows-per-page-label="$t('ROWS_PER_PAGE')"
        :pagination-label="(start, end, total)=>{return $t('PAGINATION_OF', {start, end, total})}"
        color="secondary">
        <template slot="top-right" slot-scope="props">
          <q-table-columns
            :label="$t('SHOW_COLUMNS')"
            color="secondary"
            class="q-mr-sm"
            v-model="visibleColumns"
            :columns="contactColumns"/>
          <q-btn v-if="!readOnly" no-wrap flat round icon="mdi-account-plus" color="secondary" @click="openNewContactModal()"></q-btn>
        </template>
        <template slot="body" slot-scope="props">
          <q-tr :props="props" @mouseover.native="props.expand=true" @mouseleave.native="props.expand=false">
            <q-td v-for="(col, index) in props.cols" :key="col.name" :props="props">
              {{getTableField(props.row, col.field)}}
            </q-td>
            <q-td class="command-cell gt-md" v-show="props.expand" v-if="!readOnly">
              <div>
                <q-btn color="secondary" size="md" round flat dense
                       icon="mdi-pencil" @click="openModifyContactModal(props.row.__index)">
                  <q-tooltip :delay="300" anchor="bottom left" self="top middle" :offset="[10, 10]">
                    <div class="q-caption">{{$t('MODIFY')}}</div>
                  </q-tooltip>
                </q-btn>
                <q-btn color="negative" size="md" round flat dense
                       icon="mdi-delete" @click="removeContact(props.row.__index)">
                  <q-tooltip :delay="300" anchor="bottom left" self="top middle" :offset="[10, 10]">
                    <div class="q-caption">{{$t('REMOVE')}}</div>
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

  </div>
  <contact-modal :read-only="readOnly" :contact="contact" :is-edit="isEditContact" @save="saveContact" v-model="contactModalOpened"></contact-modal>
  </div>
</template>

<script>
  import countries from 'src/statics/countries.json'
  import ContactModal from 'components/company/ContactModal'
  import {extend, date} from 'quasar'
  import {HxSelect, HxInput, HxAutocomplete, HxTextarea, HxChipsInput} from 'components/input'

  export default {
    props: ['data', 'readOnly', 'v', 'isPrivate'],
    components: {ContactModal, HxSelect, HxInput, HxAutocomplete, HxTextarea, HxChipsInput},
    data() {
      return {
        countries,
        collapsibleOpened: false,
        visibleColumns: ['firstName', 'lastName', 'email', 'phone', 'role'],
        contactColumns: [
          {
            required: true,
            label: this.$t('NAME'),
            align: 'left',
            field: 'firstName',
            name: 'firstName'
          },
          {
            required: true,
            label: this.$t('SURNAME'),
            align: 'left',
            field: 'lastName',
            name: 'lastName'
          },
          {
            required: true,
            label: this.$t('EMAIL'),
            align: 'left',
            field: 'email',
            name: 'email'
          },
          {
            required: true,
            label: this.$t('PHONE'),
            align: 'left',
            field: 'phone',
            name: 'phone'
          },
          {
            label: this.$t('ROLE'),
            align: 'left',
            field: (val) => this.$t(val.role),
            name: 'role'
          },
          {
            label: this.$t('SEX'),
            align: 'left',
            field: (val) => this.$t(val.sex),
            name: 'sex'
          },
          {
            label: this.$t('BIRTH_DATE'),
            align: 'left',
            field: (val) => date.formatDate(val.birthDate, 'YYYY-MM-DD'),
            name: 'birthDate'
          },
          {
            label: this.$t('NOTES'),
            align: 'left',
            field: 'notes',
            name: 'notes'
          }
        ],
        isEditContact: false,
        contact: {},
        modifyContactIndex: -1,
        contactModalOpened: false
      }
    },
    methods: {
      openModifyContactModal(index) {
        this.modifyContactIndex = index;
        this.openContactModal(extend({}, this.data.contacts[index]), true);
      },
      openNewContactModal() {
        this.openContactModal({}, false);
      },
      openContactModal(contact, isEdit) {
        this.contact = contact;
        this.isEditContact = isEdit;
        this.contactModalOpened = true;
      },
      saveContact(contact) {
        if (this.modifyContactIndex >= 0) {
          this.$set(this.data.contacts, this.modifyContactIndex, contact);
          this.modifyContactIndex = -1;
        } else {
          this.data.contacts.push(contact);
        }
      },
      removeContact(index) {
        this.data.contacts.splice(index, 1);
      },
      getTableField(row, field) {
        if (typeof field === "string") return row[field];
        if (typeof field === "function") return field(row);
        return null;
      }
    },
    computed: {
      formattedCountries() {
        return countries.map(c => {
          return {value: c.name, label: this.$t(c.name)}
        })
      }
    }
  }
</script>

<style>
</style>
