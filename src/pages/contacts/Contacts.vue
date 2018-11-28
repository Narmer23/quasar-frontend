<template>
  <page-layout :title="$t('CONTACTS')">

    <template slot="actions">
      <q-btn color="primary" icon="mdi-account-plus" class="q-mr-xs" :label="$t('NEW_CONTACT')" to="/contacts/new"/>
    </template>

    <template slot="fab">
      <q-btn color="primary"
             round
             class="fixed fab-button-bottom-right"
             icon="mdi-domain"
             to="/contacts/organizations/new"/>
    </template>

    <template slot="content">
        <q-collapsible class="bg-white shadow-1 q-mb-sm" header-class="text-center" :label="$t('ADVANCED_SEARCH')">
          <div class="row items-stretch gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-field>
                <q-chips-input :float-label="$t('NAME')" v-model="search.listStringFilter.name" @input="getBySearch(search)"/>
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-field>
                <q-chips-input :float-label="$t('EMAIL')" v-model="search.listStringFilter.email" @input="getBySearch(search)"/>
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-field>
                <q-chips-input :float-label="$t('PHONE')" v-model="search.listStringFilter.phone" @input="getBySearch(search)"/>
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-field>
                <q-chips-input :float-label="$t('ADDRESS')" v-model="search.listStringFilter.address" @input="getBySearch(search)"/>
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-field>
                <q-chips-input :float-label="$t('CITY')" v-model="search.listStringFilter.city" @input="getBySearch(search)"/>
              </q-field>
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-field>
                <q-select :float-label="$t('CATEGORY')" v-model="search.category" :options="categoryOptions" @input="getBySearch(search)" clearable/>
              </q-field>
            </div>
            <div class="col-12 text-center">
              <q-btn size="sm" color="secondary" flat :label="$t('RESET_FILTER')" icon="mdi-refresh" @click="resetFilterAndSearch"></q-btn>
            </div>
          </div>
        </q-collapsible>

        <q-table
          class="bg-white shadow-1"
          :data="organizations"
          :columns="columns"
          :visible-columns="visibleColumns"
          selection="single"
          row-key="id"
          :pagination.sync="pagination"
          :loading="loading"
          :no-data-label="$t('NO_ORGANIZATION_FOUND')"
          :no-results-label="$t('NO_ORGANIZATION_FOUND')"
          :loading-label="$t('LOADING')"
          :rows-per-page-label="$t('ROWS_PER_PAGE')"
          :pagination-label="(start, end, total)=>{return $t('PAGINATION_OF', {start, end, total})}"
          @request="request"
          :filter="search.quickSearch"
          color="primary">


          <template slot="top-right" slot-scope="props">
            <q-table-columns
              :label="$t('SHOW_COLUMNS')"
              color="secondary"
              class="q-mr-sm"
              v-model="visibleColumns"
              :columns="columns"
            />
            <q-btn no-wrap flat round icon="mdi-printer" color="secondary">
              <q-tooltip :delay="300" anchor="bottom left" self="top middle" :offset="[10, 10]">
                <div class="q-caption text-no-wrap">{{$t('PRINT')}}</div>
              </q-tooltip>
            </q-btn>
          </template>
          <template slot="top-left" slot-scope="props">
            <q-search
              hide-underline
              :placeholder="$t('QUICK_SEARCH')"
              color="primary"
              v-model="search.quickSearch"
              class="full-width"
              @input="resetFilter"
            />
          </template>
          <template slot="body" slot-scope="props">
            <q-tr v-show="!isPrivate(props.row)"  :props="props" @click.native="$router.push(`/contacts/modify/${props.row.id}`)" class="cursor-pointer" @mouseover.native="props.expand=true" @mouseleave.native="props.expand=false">
              <q-td auto-width>
                <q-checkbox v-show="getContactsForOrganization(props.row).length" color="secondary" v-model="expandedRows[props.row.__index]" checked-icon="remove" unchecked-icon="mdi-account-search" class="q-mr-md"/>
              </q-td>
              <q-td v-for="(col, index) in props.cols" :key="col.name" :props="props">
                {{getTableField(props.row, col.field)}}
              </q-td>
              <q-td class="command-cell gt-md" v-show="props.expand">
                <div>
                  <q-btn color="secondary" size="md" round flat dense icon="mdi-account-plus" @click.stop.prevent="openNewContactModal(props.row.__index)">
                    <q-tooltip :delay="300" anchor="bottom left" self="top middle" :offset="[10, 10]">
                      <div class="q-caption">{{$t('ADD_QUICK_CONTACT')}}</div>
                    </q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </q-tr>

            <q-tr v-show="isPrivate(props.row)"  :props="props" @click.native="$router.push(`/contacts/modify/${props.row.id}`)" class="cursor-pointer" @mouseover.native="props.expand=true" @mouseleave.native="props.expand=false">
              <q-td auto-width>
              </q-td>
              <q-td v-for="(col, index) in props.cols" :key="col.name" :props="props">
                {{getTableField(props.row, col.field)}}
              </q-td>
            </q-tr>


            <q-tr v-show="expandedRows[props.row.__index]" :props="props">
              <q-td colspan="100%" >
                <q-table
                  :data="getContactsForOrganization(props.row)"
                  :columns="contactColumns"
                  hide-bottom
                  row-key="id"
                  color="primary">
                </q-table>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <contact-modal :contact="contact" @save="saveContact" v-model="contactModalOpened"></contact-modal>


    </template>
  </page-layout>
</template>

<script>
  import OrganizationService from 'src/services/OrganizationService'
  import UserService from 'src/services/UserService'
  import ContactService from 'src/services/ContactService'
  import PageLayout from 'layouts/PageLayout'
  import ContactModal from 'components/company/ContactModal'
  import {date, LocalStorage, extend} from 'quasar'

  export default {
    components: {PageLayout, ContactModal},
    data() {
      return {
        expandedRows: [],
        categories: [],
        contact: {},
        organizationContactIndex: -1,
        contactModalOpened: false,
        visibleColumns: ['name', 'address', 'vatNumber', 'category'],
        selectedOrganizations: [],
        organizations: [],
        search: {
          listStringFilter: {
            phone: [],
            address: [],
            city: [],
            notes: [],
            email: [],
            name: []
          },
          stringFilter: {},
          numberFilter: {},
          quickSearch: ''
        },
        loading: false,
        pagination: {
          page: 1,
          rowsNumber: 0,
          rowsPerPage: 15
        },
        columns: [
          {
            name: 'name',
            required: true,
            label: this.$t('NAME'),
            align: 'left',
            field: 'name'
          }, {
            name: 'address',
            label: this.$t('ADDRESS'),
            align: 'left',
            field: (val) => val.branches.filter(b => b.mainOffice).length ? val.branches.filter(b => b.mainOffice)[0].address : ''
          }, {
            name: 'category',
            required: true,
            label: this.$t('CATEGORY'),
            align: 'left',
            field: (val) => this.$t(val.category)
          }, {
            name: 'phone',
            label: this.$t('PHONE'),
            align: 'left',
            field: (val) => val.branches.filter(b => b.mainOffice).length ? val.branches.filter(b => b.mainOffice)[0].phone : ''
          }, {
            name: 'email',
            label: this.$t('EMAIL'),
            align: 'left',
            field: (val) => val.branches.filter(b => b.mainOffice).length ? val.branches.filter(b => b.mainOffice)[0].email : ''
          }, {
            name: 'pec',
            label: this.$t('PEC'),
            align: 'left',
            field: 'pec'
          }, {
            name: 'vatNumber',
            label: this.$t('VAT_NUMBER'),
            align: 'left',
            field: 'vatNumber'
          }, {
            name: 'taxCode',
            label: this.$t('TAX_CODE'),
            align: 'left',
            field: 'taxCode'
          }
        ],
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
        ]
      }
    },
    async mounted() {
      let visibleColumns = this.$q.localStorage.get.item('organizationsVisibleColumns');
      if (visibleColumns) {
        this.visibleColumns = JSON.parse(visibleColumns);
      }
      this.categories = await OrganizationService.getCategories();
      await this.request({pagination: this.pagination})
    },
    beforeDestroy() {
      this.$q.localStorage.set("organizationsVisibleColumns", JSON.stringify(this.visibleColumns));
    },
    methods: {
      async request({pagination}) {
        this.loading = true;
        this.organizations = await OrganizationService.getSelfOrganizations(pagination, this.search);
        pagination.rowsNumber = await OrganizationService.countSelfOrganizations(this.search);
        this.pagination = pagination;
        this.loading = false;
        this.expandedRows.splice(0, this.expandedRows.length);
        this.organizations.forEach(() => this.expandedRows.push(false));
      },
      async getBySearch() {
        this.search.quickSearch = null;
        this.pagination.page = 1;
        await this.request({pagination: this.pagination})
      },

      getTableField(row, field) {
        if (typeof field === "string") return row[field];
        if (typeof field === "function") return field(row);
        return null;
      },
      getContactsForOrganization(organization) {
        return organization.branches.reduce((a, b) => {
          return a.concat(b.contacts)
        }, [])
      },
      openNewContactModal(organizationIndex) {
        this.organizationIndex = organizationIndex;
        this.contact = {};
        this.contactModalOpened = true;
      },
      async saveContact(contact) {
        contact.branch = this.organizations[this.organizationIndex].branches[0].id;
        let persistedContact = await ContactService.createContact(contact);
        console.log(persistedContact);
        this.organizations[this.organizationIndex].branches[0].contacts.push(persistedContact);
        this.organizationIndex = -1;
      },
      removeContact(index) {
        this.data.contacts.splice(index, 1);
      },
      async resetFilterAndSearch(){
        this.resetFilter();
        await this.request({pagination: this.pagination})

      },
      resetFilter() {
        this.search = {
          listStringFilter: {
            phone: [],
            address: [],
            city: [],
            notes: [],
            email: [],
            name: []
          },
          stringFilter: {},
          numberFilter: {},
          quickSearch: this.search.quickSearch
        }
      },
      isPrivate(organization){
        return organization.category === 'PRIVATO'
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
      }
    }

  }
</script>

<style lang="stylus">

</style>
