import { defineStore } from 'pinia';

export const useGeneralStore = defineStore('general', {
  state: () => {
    return {
      showPreview: false,
      signOutButton: false,
    };
  },
  actions: {
    updateState(value, variable) {
      this[variable] = value;
    },
  },
});
