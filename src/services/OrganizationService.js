import Vue from 'vue';

export default {

  roles: [],
  categories: [],

  async getSelfOrganizations(pagination, searchFilter) {
    if (!searchFilter) searchFilter = {};

    let params = {page: pagination.page - 1, pageSize: pagination.rowsPerPage};

    let {data} = await Vue.prototype.$axios.post(`/organization/search`, searchFilter, {params});


    return data;
  },
  async countSelfOrganizations(searchFilter) {
    if (!searchFilter) searchFilter = {};

    let {data} = await Vue.prototype.$axios.post(`/organization/search/count`, searchFilter);
    return data;
  },
  async getById(id) {
    let {data} = await Vue.prototype.$axios.get(`/organization/${id}`);
    return data;
  },
  async getCategories() {

    if (this.categories.length)
      return this.categories;

    let {data} = await Vue.prototype.$axios.get(`/organization/categories`);
    this.categories = data;
    return data;
  },

  async getRoles() {
    if (this.roles.length)
      return this.roles;

    let {data} = await Vue.prototype.$axios.get(`/organization/roles`);
    this.roles = data;
    return data;
  },

  async createOrganization(organization) {
    let {data} = await Vue.prototype.$axios.post(`/organization`, organization);
    return data;
  },

  async modifyOrganization(organization) {
    let {data} = await Vue.prototype.$axios.put(`/organization/${organization.id}`, organization);
    return data;
  }
}
