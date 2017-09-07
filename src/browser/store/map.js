import backend from '../backend';
import objectStore from './objectStore';

export default {
  ...objectStore('map'),
  actions: {
    async updateMap(context, { key, value }) {
      await backend.updateMap(key, value);
    },
    async updateMapBackgroundImage(context, image) {
      await backend.updateMapBackgroundImage(image);
    },
    async clearMapBackgroundImage() {
      await backend.clearMapBackgroundImage();
    },
  },
};
