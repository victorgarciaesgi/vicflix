import { BreakPointsTypes, BreakPointsValues } from '@models';
import Vue from 'vue';
import { Mixin } from 'vue-mixin-decorator';

@Mixin({})
export default class BreakPointsMixin extends Vue {
  public windowWidth = 0;
  public windowHeight = 0;

  public currentBreakPoint = BreakPointsTypes.Large;

  handleResize(event?: Event) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    if (this.windowWidth <= 450) {
      this.currentBreakPoint = BreakPointsTypes.XSmall;
    } else if (this.windowWidth <= 639) {
      this.currentBreakPoint = BreakPointsTypes.Small;
    } else if (this.windowWidth <= 767) {
      this.currentBreakPoint = BreakPointsTypes.Medium;
    } else if (this.windowWidth <= 1023) {
      this.currentBreakPoint = BreakPointsTypes.Large;
    } else if (this.windowWidth <= 1279) {
      this.currentBreakPoint = BreakPointsTypes.XLarge;
    } else {
      this.currentBreakPoint = BreakPointsTypes.XLarge;
    }
  }

  get isSmallScreen() {
    return this.windowWidth < BreakPointsValues.XSmall;
  }

  get isMobile() {
    return this.windowWidth < BreakPointsValues.Small;
  }

  get isLarge() {
    return this.windowWidth < BreakPointsValues.Large;
  }

  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
}
