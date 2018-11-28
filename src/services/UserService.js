import Vue from 'vue';

export default {

  async putUser(id, userUpdate) {
    await Vue.prototype.$axios.post(`/users/${id}`, userUpdate)
  },

  async patchUser(id, userUpdate) {
    let {data} = (await Vue.prototype.$axios.patch(`/users/${id}}`, userUpdate))
    return data;
  },
  user: null,
  getUser() {
    return this.user
  },
  async login(data) {
    let resp = (await Vue.prototype.$axios.post("/login", data)).data;
    this.user = resp.user;
    return this.user;
  },
  async getSelf() {
    let {data} = await Vue.prototype.$axios.get("/self")
    return data
  },
  async init() {
    if (this.user) return this.user;
    try {
      this.user = await this.getSelf()
      return this.user;
    } catch (error) {
    }
  },
  async logout() {
    await Vue.prototype.$axios.delete(`/logout`)
    this.user = null;
  },
  isAuthorized(authorizedOperations) {

    if (authorizedOperations === null || authorizedOperations === undefined) {
      return true;
    }

    if (!this.getUser()) {
      return false;
    }

    return this.getUser().operations.some(op => authorizedOperations.indexOf(op) >= 0);
  },
  isAuthenticated() {
    return !!this.user;
  }
}
