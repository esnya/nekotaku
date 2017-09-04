<template lang="pug">
  #app
    v-app
      transition(name="slide")
        router-view
</template>

<style lang="stylus">
.slide-enter-active, .slide-leave-active
  transition: transform 0.4s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
.slide-enter
  transform: translate(-100%, 0);
.slide-leave-to
  transform: translate(100%, 0);
</style>
