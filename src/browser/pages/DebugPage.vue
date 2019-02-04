<template lang="pug">
  .neko-app
    .neko-map-tab
      .neko-map.perspective
        .neko-map-grid
        .neko-layer
          .neko-entity
            .neko-entity-inner
              .neko-name name
</template>

<style lang="stylus" scoped>
.neko-app
  border 1px solid #ff0000
  width 100vw
  height 100vh
  overflow-y auto
  overflow-x hidden

.neko-map-tab
  border 1px solid #00ff00
  width 100vw
  height 100vh

  overflow auto

.neko-map
  border 1px solid #0000ff
  width 1000px
  height 1000px

  margin 100px 50px

  transform-origin top left
  transform scale(1.0)

  position relative
  perspective 1000

  transition all 0.4s ease-in-out
  transform-style preserve-3d
  :global(*)
    transform-style preserve-3d
    transition all 0.4s ease-in-out

  > :global(*)
    border 1px solid #000000
    position absolute
    top 0
    left 0
    width 100%
    height 100%

.neko-layer
  position absolute

  .perspective &
    transform-origin bottom
    transform rotateX(60deg)

.neko-entity
  position absolute
  border 1px solid #00FFFF
  transform translate3d(50px, 150px, 0.5px)

.neko-entity-inner
  width 50px
  height 50px

  display flex
  flex-direction row
  align-items flex-end

  border 1px solid #000000
  .perspective &
    transform-origin bottom
    transform rotateX(-60deg)

.neko-name
  border 1px solid #000000
  width 100%
  text-align center

  .perspective &
    transform translateY(-50px)
</style>
