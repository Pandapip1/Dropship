<template>
  <div class="card m-2 h-100">
    <div class="d-flex px-3 pt-3 header shadow-lg">
      <img :src="ModBuildCard.image" class="card-img" alt="Mod Build Image">
      <div class="pl-2 title-div">
        <h3 class="card-title">{{ ModBuildCard.title }}</h3>
        <div class="card-subtitle">
          <div>Game: {{ gameVersionPlatform }}</div>
        </div>
      </div>
      <VuePopper trigger="hover" :options="{placement: 'bottom'}">
        <div class="popper">
          Queue mod for install?
        </div>
        <div slot="reference" class="icon" @click="onClick()">
          <i class="fas fa-download icon"></i>
        </div>
      </VuePopper>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ModBuildCard } from '@/models/cardViewModel'
import VuePopper from 'vue-popperjs'
import GameVersion from '@/services/gameVersionService'

@Component({
  components: { VuePopper }
})
export default class VModBuildCard extends Vue {
  @Prop()
  ModBuildCard!: ModBuildCard

  onClick () {
    this.$emit('action', this.ModBuildCard)
  }

  get gameVersionPlatform () {
    const { year, month, day } = GameVersion.fromVersionNumber(this.ModBuildCard.subtitle.gameVersion)
    return GameVersion.verPlatString(this.ModBuildCard.subtitle.gamePlatform, year, month, day)
  }
}
</script>
<style scoped lang="stylus">
.popper
  background-color #0d2d42
  padding 5px
  font-size 12px
  border-radius 5px
  opacity .8
.icon
  transition all .15s ease-in-out
  color white
  font-size 20px
  cursor pointer
  &:hover
    color #6f0606
.card
  background-color #FF6868
.header
  background-color #E85555
.title-div
  width 60%
.card-img
  width 72px
  filter drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))
</style>
