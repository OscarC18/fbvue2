import facebookLogin from "./facebook-login.vue";
export const facebookLoginPkugin = {
  install: function (Vue) {
    Vue.component(facebookLogin.name, facebookLogin);
  },
};
export default facebookLogin;
