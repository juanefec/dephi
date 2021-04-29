<template>
  <q-page class="q-pa-lg">
    <q-img :src="'https://ipfs.io/ipfs/' + user.hash" width="400px" />

    <h4 class="q-mt-none q-mb-md text-weight-bold">{{ user.name }}</h4>
    <q-item-label class="text-subtitle1">
      <span class="text-grey-7">@{{ profileAddress }}</span>
    </q-item-label>

    <div class="text-body1">
      <h5>Born: {{ new Date(Number(user.birthday)).toLocaleDateString() }}</h5>
      <h5>Balance: {{ ethbalance }} ETH</h5>
      <h5>
        {{ user.bio }}
      </h5>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageAbout",
  data: () => ({
    profileAddress: "",
    wallet: {},
    user: {},
    ethbalance: "0",
  }),
  watch: {
    async $route(to, from) {
      if (to.name == "ExploreProfile" || to.name == "Profile") {
        this.profileAddress = this.$route.params.address || this.wallet.address;
        console.log(this.$route.params.address);
        console.log(this.address);
        this.user = await this.wallet.flask.methods
          .users(this.profileAddress)
          .call();

        this.ethbalance = this.wallet.web3.utils.fromWei(
          await this.wallet.web3.eth.getBalance(this.profileAddress)
        );
      }
    },
  },
  async mounted() {
    this.wallet = await this.$dephi();
    console.log(this.address);
    this.profileAddress = this.wallet.address;

    this.user = await this.wallet.flask.methods
      .users(this.profileAddress)
      .call();

    this.ethbalance = this.wallet.web3.utils.fromWei(
      await this.wallet.web3.eth.getBalance(this.profileAddress)
    );
  },
};
</script>
