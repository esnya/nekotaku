<template lang="pug">
  .neko-dice-animator-outer(:style="outerStyle" v-if="shown")
    .neko-dice-animator-inner(:style="innerStyle" @animationend="onAnimationEnd")
      dice(
        frameColor="#FFFFFF"
        :angle="dice.result"
        :backgroundColor="backgroundColor"
        :color="color"
        :faces="dice.faces"
        :firstColor="firstColor"
      )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import palette from 'google-material-color';

function hash(data: string) {
  // eslint-disable-next-line no-bitwise
  return data.split('').map(a => a.charCodeAt(0)).reduce((a, b) => (b * 7) ^ a);
}

function selectColorName(n: number) {
  const colorNames = Object.keys(palette.palette).filter(name => name !== 'White' && name !== 'Black');
  return colorNames[n % colorNames.length];
}

@Component
export default class DiceAnimator extends Vue {
  @Prop({ required: true }) dice!: {
    key: string;
    faces: number;
    result: number;
  };

  shown: boolean = true;

  private get colorName(): string {
    const {
      key,
    } = this.dice;

    const colorKey = hash(`${key}-color`);
    return selectColorName(colorKey);
  }

  get backgroundColor(): string {
    return palette.get(this.colorName);
  }

  get color(): string {
    return palette.get('White', 'Secondary');
  }

  get firstColor(): string {
    return palette.get(['Red', 'Pink', 'Deep Orange'].indexOf(this.colorName) >= 0 ? 'White' : 'Red');
  }

  get outerStyle(): object {
    return {
      animationDelay: `${Math.random() / 2}s`,
    };
  }

  get innerStyle(): object {
    const noise = Math.random() * 0.3;
    return {
      animationDelay: `${3.5 + noise}s`,
      animationDuration: `${0.4 - noise}s`,
    };
  }

  onAnimationEnd(): void {
    this.shown = false;
  }
}
</script>

<style lang="stylus" scoped>
*
  transform-style preserve-3d

.neko-dice-animator-outer
  display inline-block
  position relative

  margin 10px

  animation-name dice-roll
  animation-duration 3s
  animation-timing-function linear
  animation-fill-mode both

  transform-style preserve-3d

.neko-dice-animator-inner
  animation dice-out 0.4s linear forwards
  transform rotateX(-10deg) rotateY(-10deg)

@keyframes dice-out {
  100% {
    transform translate3d(100vw, 0, 0)
  }
}

@keyframes dice-roll {
  0% { transform: translate(0px, 0px) rotateZ(-200deg) rotateY(100deg) scale(0); }
  1% { transform: translate(3px, 1px) rotateZ(-190deg) rotateY(95deg); }
  2% { transform: translate(6px, 11px) rotateZ(-180deg) rotateY(90deg); }
  3% { transform: translate(9px, 31px) rotateZ(-170deg) rotateY(85deg); }
  4% { transform: translate(11px, 58px) rotateZ(-160deg) rotateY(80deg); }
  5% { transform: translate(14px, 94px) rotateZ(-150deg) rotateY(75deg); }
  6% { transform: translate(17px, 140px) rotateZ(-140deg) rotateY(70deg); }
  7% { transform: translate(20px, 194px) rotateZ(-130deg) rotateY(65deg); }
  8% { transform: translate(23px, 171px) rotateZ(-120deg) rotateY(60deg); }
  9% { transform: translate(25px, 147px) rotateZ(-110deg) rotateY(55deg); }
  10% { transform: translate(28px, 132px) rotateZ(-100deg) rotateY(50deg); }
  11% { transform: translate(30px, 126px) rotateZ(-90deg) rotateY(45deg); }
  12% { transform: translate(33px, 129px) rotateZ(-80deg) rotateY(40deg); }
  13% { transform: translate(35px, 141px) rotateZ(-70deg) rotateY(35deg); }
  14% { transform: translate(37px, 162px) rotateZ(-60deg) rotateY(30deg); }
  15% { transform: translate(40px, 192px) rotateZ(-50deg) rotateY(25deg); }
  16% { transform: translate(42px, 185px) rotateZ(-40deg) rotateY(20deg); }
  17% { transform: translate(44px, 175px) rotateZ(-30deg) rotateY(15deg); }
  18% { transform: translate(46px, 173px) rotateZ(-20deg) rotateY(10deg); }
  19% { transform: translate(48px, 180px) rotateZ(-10deg) rotateY(5deg); }
  20% { transform: translate(50px, 195px) rotateZ(0deg) rotateY(0deg); }
  21% { transform: translate(51px, 192px) rotateZ(0deg) rotateY(0deg); }
  22% { transform: translate(53px, 190px) rotateZ(0deg) rotateY(0deg); }
  23% { transform: translate(54px, 197px) rotateZ(0deg) rotateY(0deg); }
  24% { transform: translate(56px, 196px) rotateZ(0deg) rotateY(0deg); }
  25% { transform: translate(57px, 198px) rotateZ(0deg) rotateY(0deg); }
  26% { transform: translate(58px, 198px) rotateZ(0deg) rotateY(0deg); }
  27% { transform: translate(59px, 199px) rotateZ(0deg) rotateY(0deg); }
  28% { transform: translate(59px, 199px) rotateZ(0deg) rotateY(0deg); }
  29% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  30% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  31% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  32% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  33% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  34% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  35% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  36% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  37% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  38% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  39% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  40% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  41% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  42% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  43% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  44% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  45% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  46% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  47% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  48% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  49% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  50% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  51% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  52% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  53% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  54% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  55% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  56% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  57% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  58% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  59% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  60% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  61% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  62% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  63% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  64% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  65% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  66% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  67% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  68% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  69% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  70% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  71% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  72% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  73% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  74% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  75% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  76% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  77% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  78% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  79% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  80% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  81% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  82% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  83% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  84% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  85% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  86% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  87% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  88% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  89% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  90% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  91% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  92% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  93% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  94% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  95% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  96% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  97% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  98% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  99% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
  100% { transform: translate(60px, 199px) rotateZ(0deg) rotateY(0deg); }
}
</style>
