import { TechnosList } from '@constants';

export interface Project {
  title: string;
  description: string;
  picture: string;
  logo: string;
  technos: TechnosList[];
  link?: string;
}
export interface Techno {
  title: string;
  logo: string;
}
