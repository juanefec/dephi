<template>
  <q-page v-if="profileAddress && profileAddress != ''" class="q-pa-lg overflow-hidden">
    <Timeline :fromUser="profileAddress" class="absolute full-width full-height">
      <div class="text-center">
        <q-img :src="'https://ipfs.io/ipfs/' + user.hash" width="400px" />

        <h4 class="q-mt-none q-mb-md text-weight-bold">{{ user.name }}</h4>
        <q-item-label class="text-subtitle1">
          <span class="text-grey-7">@{{ profileAddress }}</span>
        </q-item-label>

        <div class="text-body1">
          <h5>
            Born: {{ new Date(Number(user.birthday)).toLocaleDateString() }}
          </h5>
          <h5>Balance: {{ ethbalance }} ETH</h5>
          <h5>
            {{ user.bio }}
          </h5>
        </div>
      </div>
      <q-separator class="" color="dark" size="10px" />
    </Timeline>
  </q-page>
</template>

<script>
import Timeline from "./timeline/Timeline";
export default {
  name: "PageAbout",
  components: { Timeline },
  data: () => ({
    profileAddress: "",
    wallet: {},
    user: {},
    ethbalance: "0"
  }),
  watch: {
    async $route(to, from) {
      if (to.name == "ExploreProfile" || to.name == "Profile") {
        this.profileAddress = this.$route.params.address || this.wallet.address;
        
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

    this.profileAddress = this.$route.params.address || this.wallet.address;
    console.log(this.profileAddress)
    this.user = await this.wallet.flask.methods
      .users(this.profileAddress)
      .call();

    this.ethbalance = this.wallet.web3.utils.fromWei(
      await this.wallet.web3.eth.getBalance(this.profileAddress)
    );
  },
};
</script>
