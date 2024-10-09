import { defineStore } from 'pinia';

export const useGeneralStore = defineStore('general', {
  state: () => {
    return {
      showPreview: false,
      signOutButton: false,
      loading: false,
      warning: false,
    };
  },
  actions: {
    updateDetails(item) {
      const statesNames = Object.keys(this.$state);
      for (const data in item) {
        if (statesNames.includes(data)) {
          this.$state[data] = item[data];
        }
      }
    },
  },
});
