<template>
  <footer>
    <a class="author" href="https://github.com/ArkadiiVodolazskyi">
      <img
        class="author-avatar"
        width="60"
        src="https://avatars.githubusercontent.com/u/49953024?v=4"
        alt="Arkadii Vodolazskyi"
      />
      <p class="author-name">Arkadii Vodolazskyi</p>
    </a>
  </footer>
</template>

<style lang="sass">
footer
  position: absolute
  z-index: 5
  bottom: 0
  left: 50%
  transform: translate(-50%, 0)
  padding: .5em
.author
  text-align: center
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  color: hsl(var(--acc-main))
  transition: filter .2s ease
  &:hover
    filter: hue-rotate(50deg)
    .author-avatar
      transform: scale(1.1)
.author-avatar
  transition: transform .2s ease
.author-link
  font-style: oblique
</style>
