import { TechnosList } from '@constants';
import { BaseItemInterface, ExperienceType, ProjectLink } from './project.model';

export interface Experience extends BaseItemInterface {
  description: string;
  year: number;
  duration: number;
  title: string;
  technos: TechnosList[];
  role: string;
  links?: ProjectLink[];
  type: ExperienceType;
  currentPosition?: true;
  location: string;
}
