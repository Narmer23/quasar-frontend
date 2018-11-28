import Vue from 'vue';

export default {

  roles: [],
  categories: [],

  async getSelfContacts(pagination, searchFilter) {
    if (!searchFilter) searchFilter = {};

    let params = {page: pagination.page - 1, pageSize: pagination.rowsPerPage};
    let {data} = await Vue.prototype.$axios.post(`/contact/search`, searchFilter, {params});

    return data;
  },
  async countSelfContacts(searchFilter) {
    if (!searchFilter) searchFilter = {};
    let {data} = await Vue.prototype.$axios.post(`/contact/search/count`, searchFilter);
    return data;
  },
  async getById(id) {
    let {data} = await Vue.prototype.$axios.get(`/contact/${id}`);
    return data;
  },
  async getCategories() {

    if (this.categories.length)
      return this.categories;

    let {data} = await Vue.prototype.$axios.get(`/contact/categories`);
    this.categories = data;
    return data;
  },

  async getRoles() {
    if (this.roles.length)
      return this.roles;

    let {data} = await Vue.prototype.$axios.get(`/contact/roles`);
    this.roles = data;
    return data;
  },

  async createContact(contact) {
    let {data} = await Vue.prototype.$axios.post(`/contact`, contact);
    return data;
  },
  async deleteContact(contact) {
    let {data} = await Vue.prototype.$axios.delete(`/contact/${contact.id}`);
    return data;
  },
  async modifyContact(contact) {
    let {data} = await Vue.prototype.$axios.put(`/contact/${contact.id}`, contact);
    return data;
  },

}
