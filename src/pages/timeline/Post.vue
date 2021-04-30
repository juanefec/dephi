<template>
  <q-item class="qweet q-py-md">
    <q-item-section avatar top>
      <q-avatar size="xl">
        <img :src="'https://ipfs.io/ipfs/' + userpost.authorProfilePic" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label @click="goToProfile(userpost.author)" class="text-subtitle1">
        <strong>{{ userpost.authorName }}</strong>
        <span class="text-grey-7">
          @{{ userpost.author }} <br class="lt-md" />&bull;
          {{ userpost.timestamp || new Date() | relativeDate }}
        </span>
      </q-item-label>
      <q-item-label class="qweet-content text-body1">
        {{ userpost.text }}
      </q-item-label>
      <div
        v-if="userpost.media != 'none'"
        class="qweet-icons row justify-between q-mt-sm"
      >
        <q-card class="my-card">
          <video
            v-if="userpost.mediaType && userpost.mediaType.includes('video')"
            width="400px"
            controls
          >
            <source
              :src="'https://ipfs.io/ipfs/' + userpost.media"
              :type="userpost.mediaType"
            />
            Your browser does not support the video tag.
          </video>

          <audio
            v-if="userpost.mediaType && userpost.mediaType.includes('audio')"
            width="400px"
            controls
          >
            <source
              :src="'https://ipfs.io/ipfs/' + userpost.media"
              :type="userpost.mediaType"
            />
            Your browser does not support the audio tag.
          </audio>

          <q-img
            v-if="userpost.mediaType && userpost.mediaType.includes('image')"
            :src="'https://ipfs.io/ipfs/' + userpost.media"
            width="400px"
          />
        </q-card>
      </div>
      <div class="qweet-icons row q-mt-sm">
        <!-- <q-btn
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                  flat
                  round
                />
                <q-btn
                  @click="toggleLiked(qweet)"
                  :color="qweet.liked ? 'pink' : 'grey'"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                  flat
                  round
                /> -->
        <q-btn
          @click="tipOwner()"
          size=""
          icon="fab fa-ethereum"
          flat
          round
        >
        </q-btn>
        <q-input
          v-model="tipInput"
          width="30px"
          type="number"
          dense
        ></q-input>
        <q-item-label class="text-subtitle1">
          <span class="text-grey-7">
            Tips collected: {{ userpost.collectedTips || 0 }} ETH
          </span>
        </q-item-label>
      </div>
    </q-item-section>
  </q-item>
</template>
<script>

import { formatDistance } from "date-fns";
export default {
  props: ["postID"],
  data: () => ({
    wallet: {},
    userpost: {},
    tipDefault: '0.1',
    tipInput: '',
  }),
  methods: {
      goToProfile(id) {
          this.$emit('goToProfile', id)
      },
      async tipOwner() {
      let tip = this.wallet.web3.utils.toWei(this.tipInput);
      this.wallet.flask.methods
        .tipImageOwner(this.postID)
        .send({ from: this.wallet.address, value: tip })
        .on("transactionHash", (hash) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Tipped",
          });
        this.tipInput = this.tipDefault;
        });
    },
  },
   filters: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
  },
  async mounted() {
    this.wallet = await this.$dephi();

    let post = await this.wallet.flask.methods.posts(this.postID).call();

    let user = await this.wallet.flask.methods.users(post.author).call();

    let [hash, type] = post.hash.split("||");

    let userpost = {
      id: post.id,
      media: hash,
      mediaType: type,
      text: post.text,
      author: post.author,
      collectedTips: this.wallet.web3.utils.fromWei(post.tipAmount),
      timestamp: new Date(Number(post.timestamp)),
      authorName: user.name,
      authorProfilePic: user.hash
    };
    this.userpost = userpost;
    this.tipInput = this.tipDefault
  },

};
</script>