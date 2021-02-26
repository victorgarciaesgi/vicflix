import { TechnosList } from '@constants';

export interface ProjectLink {
  title: string;
  link: string;
}

export interface ProjectVideo {
  title: string;
  duration: number;
  description: string;
  episode: number;
  preview: string;
  id: string;
  projectId: string;
  videoUrl: string;
}
export interface Project {
  title: string;
  description: string;
  picture: string;
  logo: string;
  technos: TechnosList[];
  links?: ProjectLink[];
  year: number;
  videos: ProjectVideo[];
  type: ProjectType;
  id: string;
}
export interface Techno {
  title: string;
  logo: string;
}

export enum ProjectType {
  Site = 'Website',
  App = 'App',
}
