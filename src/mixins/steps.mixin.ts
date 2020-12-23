import { IStep } from '@models';
import Vue from 'vue';
import { Mixin } from 'vue-mixin-decorator';

@Mixin({})
export default class StepsMixin extends Vue {
  public stepsCount = 0;
  public stepsList?: IStep[];
  public initialStep = 0;
  public currentStep = 0;

  get stepProps() {
    return {
      steps: this.stepsList,
      stepsCount: this.listCount,
      currentStep: this.currentStep,
      setStep: this.setStep,
    };
  }

  get selectedStep() {
    return this.stepsList?.[this.currentStep];
  }

  get listCount() {
    return this.stepsList?.length ?? this.stepsCount;
  }

  previous() {
    if (this.currentStep > 0) this.currentStep--;
  }
  next() {
    if (this.currentStep < this.listCount - 1) this.currentStep++;
  }
  navigate(step: number) {
    if (step > 0 && step < this.listCount) {
      this.currentStep = step;
    }
  }
  setStep(index: number) {
    if (index < this.currentStep) {
      this.currentStep = index;
    }
  }

  created() {
    this.currentStep = this.initialStep ?? 0;
  }
}
