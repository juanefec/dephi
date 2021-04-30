<template>
  <q-layout view="lHr lpR fFf">
    <q-header bordered class="bg-dark text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title class="text-weight-bold">
          <span class="gt-sm">{{ $route.name }}</span>
          <q-icon
            class="header-icon q-pa-md lt-md"
            name="fas fa-flask"
            size="sm"
            color="primary"
          />
        </q-toolbar-title>
        <q-toolbar-title>
          <span class="gt-xs">Connected: {{ wallet.displayAddress || 'Not conneted' }}</span>
          <span class="gt-xs"> - </span>
          <span class="gt-xs">Balance: {{ balance || '' }} ETH</span>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="left"
      side="left"
      :width="283"
      bordered
      show-if-above
    >
      <q-icon
        class="q-pa-md"
        name="fas fa-flask"
        size="lg"
        color="primary"
      />

      <q-list>
        <q-item
          @click="goTo('/', {wallet})"
          v-ripple
          clickable
          exact
        >
          <q-item-section avatar>
            <q-icon name="home" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">Home</q-item-section>
        </q-item>
        
        <q-item
          @click="goTo('/profile', {wallet})"
          v-ripple
          clickable
          exact
        >
          <q-item-section avatar>
            <q-icon name="account_circle" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">Profile</q-item-section>
        </q-item>

        <q-item
          @click="goTo('/about')"
          v-ripple
          clickable
          exact
        >
          <q-item-section avatar>
            <q-icon name="help" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">About</q-item-section>
        </q-item>
      </q-list>

    </q-drawer>
    <!--
    <q-drawer show-if-above v-model="right" side="right" bordered>
      <q-input
        placeholder="Search DePhi"
        class="q-ma-md"
        outlined
        rounded
        dense
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-list
        separator
        padding
      >
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Education</q-item-label>
            <q-item-label class="text-weight-bold">Something amazing happened!</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Education</q-item-label>
            <q-item-label class="text-weight-bold">Something amazing happened!</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Education</q-item-label>
            <q-item-label class="text-weight-bold">Something amazing happened!</q-item-label>
            <q-item-label caption>Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    -->
    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      wallet: {},
      balance: null,
      left: false,
      right: false
    }
  },
  methods: {
    goTo(location) {
      if (this.$router.currentRoute.path != location) this.$router.push(location)
    }
  },
  async mounted() {
    this.wallet = await this.$dephi()
    this.balance = web3.utils.fromWei(await web3.eth.getBalance(this.wallet.address))


  }
}
</script>

<style lang="sass">
.header-icon
  position: absolute
  bottom: 0
  left: 50%
  transform: translateX(-50%)
</style>