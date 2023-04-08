<template>
  <form class="add-location" @submit.prevent="submitLocation">
    <h2>Add Location</h2>
    <input type="text" v-model="newLocation" />
  </form>
</template>

<script>
export default {
  emits: ['add-location'],
  data() {
    return {
      newLocation: '',
    };
  },
  methods: {
    submitLocation() {
      this.$emit('add-location', this.newLocation);
      this.newLocation = '';
    },
  },
};
</script>
