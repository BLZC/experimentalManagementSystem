import Vue from 'vue';
import Vuex from "vuex";
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
      type: ""
    },
    mutations: {
      changetype (state, type) {
       state.type = type;
      }
    }
  })

  export default store;