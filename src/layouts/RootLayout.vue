<template>
  <q-layout view="hHh Lpr lFr" class="layout-background">
    <!-- Header -->
    <q-layout-header>
      <q-toolbar class="q-pr-md">

        <q-btn flat dense class="gt-md" @click="isMini = !isMini">
          <q-icon name="mdi-menu" size="25px"></q-icon>
        </q-btn>

        <q-btn flat class="lt-lg" icon="menu" @click="leftDrawerOpen = !leftDrawerOpen"/>

        <q-toolbar-title>

        </q-toolbar-title>
        <!--<q-search class="q-mr-sm" :placeholder="$t('SEARCH')" inverted color="tertiary" v-model="search" />-->


        <q-btn round flat class="q-mr-sm">
          <q-icon name="mdi-bell" size="30px"></q-icon>
        </q-btn>

        <q-btn round flat :style="{'background-image': `url(${avatarPath})`}" class="toolbar-avatar">
          <q-popover>
            <q-list>
              <q-item link to="/profile">
                <q-item-main>
                  <div class="row">
                    <img :src="avatarPath" class="avatar avatar-big q-mr-md"/>
                    <div>
                      <q-item-tile label>{{user.firstName + ' ' + user.lastName }}</q-item-tile>
                      <q-item-tile sublabel>{{user.email}}</q-item-tile>
                      <q-item-tile class="q-caption text-primary uppercase">{{user.company.name}}</q-item-tile>
                    </div>
                  </div>
                </q-item-main>
              </q-item>
              <q-item-separator/>

              <q-item>

                <q-btn-group outline>
                  <q-btn no-wrap to="/settings" icon="mdi-settings" :label="$t('SETTINGS')"/>
                  <q-btn no-wrap class="text-primary" icon="mdi-logout" :label="$t('LOGOUT')" @click="logout"/>
                </q-btn-group>

              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
      </q-toolbar>

      <router-view name="headerTabs"/>


    </q-layout-header>
    <!-- Left Side Panel -->
    <q-layout-drawer :mini="isMini" v-model="leftDrawerOpen">
      <div slot="mini">
        <nav-menu :is-mini="true"></nav-menu>
      </div>
      <nav-menu :is-mini="false"></nav-menu>
    </q-layout-drawer>

    <q-page-container>
      <router-view name="contentTabs"/>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>
<script>
  import NavMenu from "components/NavMenu";
  import UserService from "src/services/UserService"

  export default {
    components: {NavMenu},
    data() {
      return {
        leftDrawerOpen: true,
        isMini: true,
        avatarPath: '/statics/no_avatar.png'
      };
    },
    computed: {
      user() {
        return UserService.getUser();
      }
    },
    methods: {
      async logout() {
        await UserService.logout();
        this.$router.push("/login");
      }
    }
  };
</script>
<style lang="stylus">
  @import '~variables'
  .toolbar-avatar
    background-position center
    background-size cover
    background-repeat no-repeat

  .layout-background
    background-color #dae3ea
</style>

