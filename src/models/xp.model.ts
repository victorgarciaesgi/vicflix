import { TechnosList } from '@constants';
import { BaseItemInterface } from './project.model';

export interface Experience extends BaseItemInterface {
  description: string;
  year: number;
  duration?: number;
  title: string;
  technologies: TechnosList[];
  role: string;
}
