// src/vuexPersist.js
import VuexPersistence from 'vuex-persist';

const vuexPersist = new VuexPersistence({
  storage: window.localStorage,
  modules: ['app'],
  reducer: (state) => ({
    app: {
      invitation: state.app.invitation
    }
  }) 
});

export default vuexPersist;
