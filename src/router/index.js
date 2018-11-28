import Vue from 'vue'
import VueRouter from 'vue-router'
import UserService from 'src/services/UserService'
import {Loading} from 'quasar'

import routes from './routes'

Vue.use(VueRouter)


const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/*
// Inform Google Analytics
Router.beforeEach((to, from, next) => {
  if (typeof ga !== 'undefined') {
    ga('set', 'page', to.path)
    ga('send', 'pageview')
  }
  next()
})
*/

Router.beforeEach(async (to, from, next) => {
  await UserService.init();
  Loading.show();
  const authorizedOperations = to.meta.authorizedOperations;
  if (!authorizedOperations || authorizedOperations.length <= 0) {
    throw "Operations not defined for next state";
  }
  if (authorizedOperations.indexOf("NO_OP") < 0) {
    if (!UserService.isAuthorized(authorizedOperations)) {
      console.log("Missing operation: ", authorizedOperations);
      if (UserService.isAuthenticated()) {
        //TODO emit event not has permission
        next(false)
      } else {
        //TODO emit event notAuthenticated
        next("login")
      }
    } else {
      next();
    }
  } else { // if no op
    if (to.path === "/login") {
      if (UserService.isAuthenticated()) {
        next("/")
      } else {
        next()
      }
    } else {
      next()
    }
  }
});
Router.afterEach((to, from) => {
  Vue.nextTick(function () {
    Loading.hide();
  })
});

export default Router
