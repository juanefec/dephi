<template>
  <q-page class="relative-position">
    
      <div class="absolute full-width full-height overflow-hidden">
        <div class="q-pt-md q-px-md row items-end q-col-gutter-md">
          <div class="col">
            <q-input
              v-model="newTextFlaskitContent"
              class="new-qweet"
              placeholder="What's happening?"
              maxlength="280"
              bottom-slots
              counter
              autogrow
            >
              <template v-slot:before>
                <q-avatar size="xl">
                  <img
                    v-bind:src="
                      user.hash ? 'https://ipfs.io/ipfs/' + user.hash : ''
                    "
                  />
                </q-avatar>
              </template>
            </q-input>
          </div>
          <div class="col col-shrink">
            <q-btn
              @click="sendFlask"
              :disable="!newTextFlaskitContent"
              class="q-mb-lg"
              color="primary"
              label="Flaskit"
              rounded
              unelevated
              no-caps
            />
          </div>
        </div>
        <div class="q-px-md q-pb-sm q-gutter-md">
          <q-file
            ref="specialInput"
            v-model="pic"
            @input="updatePreview"
            filled
            style="display: none"
          />
          <q-btn
            round
            size="sm"
            color="green"
            icon="add_a_photo"
            @click="toggle"
          />

          <!-- using v-if so you can see the effect -->
          <q-img
            v-if="previewPic !== null"
            width="500px"
            v-bind:src="previewPic"
          />

          <q-btn
            v-if="previewPic !== null"
            round
            size="sm"
            color="red"
            icon="close"
            @click="cancelMedia"
          />
        </div>

        <q-separator class="" color="dark" size="10px" />
      <Timeline/> 
      </div>
  </q-page>
</template>

<script>
import { formatDistance } from "date-fns";
import Timeline from './timeline/Timeline'
export default {
  name: "PageHome",
  components: {Timeline},
  data() {
    return {
      wallet: {},
      user: {},
      pic: null,
      previewPic: null,
      bytesPic: null,
      url: null,
      newTextFlaskitContent: "",
    };
  },
  methods: {
    toggle() {
      this.$refs.specialInput.$el.click();
    },
    cancelMedia() {
      this.pic = null;
      this.previewPic = null;
      this.bytesPic = null;
    },
    updatePreview() {
      let readerB64 = new FileReader();
      readerB64.readAsDataURL(this.pic);
      readerB64.onload = () => (this.previewPic = readerB64.result);
      readerB64.onerror = () => (this.previewPic = "");
      let readerBytes = new FileReader();
      readerBytes.readAsArrayBuffer(this.pic);
      readerBytes.onload = () => (this.bytesPic = Buffer(readerBytes.result));
    },
    goToProfile(author) {
      this.$router.push("/profile/" + author);
    },
    async sendFlask() {
      let result;
      if (this.bytesPic != null) {
        result = await this.wallet.ipfs.add(this.bytesPic);
      }
      let timestamp = new Date().getTime();
      this.wallet.flask.methods
        .uploadPost(
          result ? `${result.path}||${this.pic.type}` : "none",
          this.newTextFlaskitContent,
          timestamp
        )
        .send({ from: this.wallet.address })
        .on("transactionHash", (hash) => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Submitted",
          });
          this.newTextFlaskitContent = "";
          this.cancelMedia();
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

    this.user = await this.wallet.flask.methods
      .users(this.wallet.address)
      .call();
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
