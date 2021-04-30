<template>
  <div>
    <div></div>

    <div class="fixed-center" style="max-width: 400px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-card class="my-card">
          <q-img v-bind:src="previewProfilePic"> </q-img>
        </q-card>
        <q-file
          v-model="profilePic"
          label="Profile picture"
          @input="updatePreview"
          filled
        />
        <q-input
          filled
          v-model="name"
          label="Name"
          hint="Name or nickname"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input filled v-model="birthday" hint="Birthday" label="Birthday">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="birthday" mask="DD/MM/YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          filled
          v-model="bio"
          label="Bio"
          hint="Short bio"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-toggle v-model="accept" label="I accept that anything I upload can't be deleted or" />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import wallet from '../boot/boot'
export default {
  data() {
    return {
      wallet:{},
      name: null,
      bio: null,
      profilePic: null,
      previewProfilePic: null,
      bytesProfilePic: null,
      birthday: null,
      accept: false,
    };
  },
  async mounted() {
    this.wallet = await wallet
  },
  methods: {
    updatePreview() {
      let readerB64 = new FileReader();
      readerB64.readAsDataURL(this.profilePic);
      readerB64.onload = () => (this.previewProfilePic = readerB64.result);
      readerB64.onerror = () => (this.previewProfilePic = "");
      let readerBytes = new FileReader();
      readerBytes.readAsArrayBuffer(this.profilePic);
      readerBytes.onload = () =>
        (this.bytesProfilePic = Buffer(readerBytes.result));
      readerBytes.onerror = () => (this.previewProfilePic = "");
    },
    async onSubmit() {
      if (this.accept !== true) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: "You need to accept the license and terms first",
        });
      } else {
        let result = await this.wallet.ipfs.add(this.bytesProfilePic)

        var dateParts = this.birthday.split("/");

        let birthdayInt = (new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])).getTime()
        let timestamp = (new Date()).getTime()
        this.wallet.flask.methods
          .createUser(result.path, this.name, this.bio, birthdayInt, timestamp)
          .send({ from: this.wallet.address })
          .on("transactionHash", (hash) => {
            this.$q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Submitted",
            });
            this.$router.push("/");
          });
      }
    },
    onReset() {
      this.name = null;
      this.bio = null;
      this.profilePic = null;
      this.previewProfilePic = null;
      this.birthday = null;
      this.accept = false;
    },
  },
};
</script>