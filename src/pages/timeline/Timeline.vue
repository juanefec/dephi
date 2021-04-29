<template>
    <q-scroll-area class="fit">
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="post in posts" :key="post.id" class="qweet q-py-md" >
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img :src="'https://ipfs.io/ipfs/' + post.authorProfilePic" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label
                @click="goToProfile(post.author)"
                class="text-subtitle1"
              >
                <strong>{{ post.authorName }}</strong>
                <span class="text-grey-7">
                  @{{ post.author }} <br class="lt-md" />&bull;
                  {{ post.timestamp || new Date() | relativeDate }}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body1">{{
                post.text
              }}</q-item-label>
              <div
                v-if="post.media != 'none'"
                class="qweet-icons row justify-between q-mt-sm"
              >
                <q-card class="my-card">
                  <video
                    v-if="post.mediaType && post.mediaType.includes('video')"
                    width="400px"
                    controls
                  >
                    <source
                      :src="'https://ipfs.io/ipfs/' + post.media"
                      :type="post.mediaType"
                    />
                    Your browser does not support the video tag.
                  </video>

                  <audio
                    v-if="post.mediaType && post.mediaType.includes('audio')"
                    width="400px"
                    controls
                  >
                    <source
                      :src="'https://ipfs.io/ipfs/' + post.media"
                      :type="post.mediaType"
                    />
                    Your browser does not support the audio tag.
                  </audio>

                  <q-img
                    v-if="post.mediaType && post.mediaType.includes('image')"
                    :src="'https://ipfs.io/ipfs/' + post.media"
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
                  @click="tipOwner(post.id, post.tipInput)"
                  size=""
                  icon="fab fa-ethereum"
                  flat
                  round
                >
                </q-btn>
                <q-input
                  v-model="post.tipInput"
                  width="30px"
                  type="number"
                  dense
                ></q-input>
                <q-item-label class="text-subtitle1">
                  <span class="text-grey-7">
                    Tips collected: {{ post.collectedTips || 0 }} ETH
                  </span>
                </q-item-label>
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
</template>

<script>
import { formatDistance } from "date-fns";
export default {
  name: "Timeline",
  data() {
    return {
      wallet: {},
      posts: [],
      lastPostId: 0,
      tipDefault: "0.1",
    };
  },
  methods: {
    goToProfile(author) {
      this.$router.push("/profile/" + author);
    },
    async tipOwner(postID, tipAmount) {
      let tip = this.wallet.web3.utils.toWei(tipAmount);
      this.wallet.flask.methods
        .tipImageOwner(postID)
        .send({ from: this.wallet.address, value: tip })
        .on("transactionHash", (hash) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Tipped",
          });
        });
      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].id == postID)
          this.posts[i].tipInput = this.tipDefault;
      }
    },
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
  },
  async mounted() {

    this.wallet = await this.$dephi();

    let updateTimeline = async () => {
      const postCount = Number(
        await this.wallet.flask.methods.postCount().call()
      );
      if (postCount > this.lastPostId) {
        this.lastPostId =
          postCount - this.lastPostId > 30 ? postCount - 30 : this.lastPostId;
        for (let i = this.lastPostId + 1; i <= postCount; i++) {
          let post = await this.wallet.flask.methods.posts(i).call();
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
            authorProfilePic: user.hash,
            tipInput: this.tipDefault,
          };
          this.posts.unshift(userpost);
        }
        this.lastPostId =
          this.posts.length >= 1 ? Number(this.posts[0].id) : this.lastPostId;
      }
      setTimeout(updateTimeline, 5000);
    };
    await updateTimeline();
  },
};
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
</style>
