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

<template>
  <form class="add-location" @submit.prevent="submitLocation">
    <h2>Add Location</h2>
    <input
      class="location-input"
      type="text"
      v-model="newLocation"
      placeholder="London"
    />
  </form>
</template>

<style lang="sass">
.add-location
  padding: 1.5em
  border-radius: 1em
  background-color: hsl(0 100% 100% / .15)
  display: flex
  align-items: center
  justify-content: space-between
  gap: 1.5em
h2
  font-size: 1em
.location-input
  flex-grow: 1
  border-radius: .5em
  border-color: transparent
  padding: .2em .5em
  background-color: hsl(0 0% 95% / .2)
  color: hsl(0 0% 95% / .9)
</style>
