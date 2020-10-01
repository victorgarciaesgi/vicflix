export interface IProgressState {
  percent: number;
  show: boolean;
  canSuccess: boolean;
  duration: number;
  height: string;
  color: string;
  failedColor: string;
  loaderColor: string;
  type: 'progress' | 'loader' | null;
}
