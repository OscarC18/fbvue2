<template>
  <div class="facebook-login">
    <button @click="buttonClicked">
      <i class="spinner" v-if="isWorking"></i>
      <img :src="icon" v-if="!isWorking" />{{ getButtonText }}
    </button>
  </div>
</template>

<script>
// Helpers
import { loadFbSdk, getFbLoginStatus, fbLogout, fbLogin } from "./helpers.js";
// Resources
import icon from "./svg/bochisi.webp";
export default {
  name: "facebook-login",
  props: {
    appId: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      default: "v2.10",
    },
    logoutLabel: {
      type: String,
      default: "Log out from Facebook",
    },
    loginLabel: {
      type: String,
      default: "Log in to Facebook",
    },
    loginOptions: {
      type: Object,
      default: function () {
        return {
          scope: "email",
        };
      },
    },
  },
  data() {
    return {
      isWorking: false,
      isConnected: false,
      icon,
    };
  },
  mounted() {
    this.isWorking = true;
    loadFbSdk(this.appId, this.version)
      .then(getFbLoginStatus)
      .then((response) => {
        if (response.status === "connected") {
          this.isConnected = true;
        }
        this.isWorking = false;
        /** Event `get-initial-status` to be deprecated in next major version! */
        this.$emit("get-initial-status", response);
        this.$emit("sdk-loaded", {
          isConnected: this.isConnected,
          FB: window.FB,
        });
      });
  },
  computed: {
    getButtonText() {
      switch (this.isConnected) {
        case true:
          return this.logoutLabel;
        case false:
          return this.loginLabel;
        default:
          return "this is default";
      }
    },
  },
  methods: {
    buttonClicked() {
      this.$emit("click");
      if (this.isConnected) {
        this.logout();
      } else {
        this.login();
      }
    },
    login() {
      this.isWorking = true;
      fbLogin(this.loginOptions).then((response) => {
        if (response.status === "connected") {
          this.isConnected = true;
        } else {
          this.isConnected = false;
        }
        this.isWorking = false;
        this.$emit("login", {
          response,
          FB: window.FB,
        });
      });
    },
    logout() {
      this.isWorking = true;
      fbLogout().then((response) => {
        this.isWorking = false;
        this.isConnected = false;
        this.$emit("logout", response);
      });
    },
  },
};
</script>

<style scoped>
.facebook-login {
  box-sizing: border-box;
}

.facebook-login * {
  box-sizing: inherit;
}

.facebook-login button {
  border: none;
  color: #fff;
  position: relative;
  line-height: 34px;
  min-width: 225px;
  padding: 0 15px 0px 46px;
  background-image: linear-gradient(#4c69ba, #3b55a0);
}

.facebook-login .spinner {
  left: 5px;
  width: 30px;
  height: 90%;
  display: block;
  border-radius: 50%;
  position: absolute;
  border: 5px solid #f3f3f3;
  border-top-color: #3498db;
  animation: facebook-login-spin 2s linear infinite;
}

.facebook-login img {
  position: absolute;
  top: 1px;
  left: 9px;
  width: 55px;
}

@keyframes facebook-login-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
