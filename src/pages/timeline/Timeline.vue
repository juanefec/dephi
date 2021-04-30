<template>
  <q-scroll-area class="fit">
    <slot></slot>
    <q-list separator>
      <transition-group
        appear
        enter-active-class="animated fadeIn slow"
        leave-active-class="animated fadeOut slow"
      >
        <Post v-for="post in posts" :ref="'post'+post.id" :key="post.id" :postID="post.id" @goToProfile="goToProfile" />
        
      </transition-group>
    </q-list>
  </q-scroll-area>
</template>

<script>
import Post from "./Post"
import { formatDistance } from "date-fns";
export default {
  name: "Timeline",
  components: { Post },
  props: ['fromUser'],
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
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
  },
  async mounted() {
    this.wallet = await this.$dephi();

    if (this.fromUser && this.fromUser != '') {
      this.posts = (await this.wallet.flask.methods
      .getUserPosts(this.fromUser)
      .call()).map(v => ({id:parseInt(v)})).reverse();
      return
    }
    const postCount = Number(
        await this.wallet.flask.methods.postCount().call()
      );
    for (let i = postCount;i > 0 && i > postCount-15; i--) {
      this.posts.push({id: i})
    }
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
