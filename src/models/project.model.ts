import { TechnosList } from '@constants';

export interface ProjectLink {
  title: string;
  link: string;
}

export interface ProjectVideo {
  title: string;
  duration: string;
  description: string;
  episode: number;
  preview: string;
  id: string;
  projectId: string;
  videoUrl: string;
}
export interface Project {
  title: string;
  slogan?: string;
  description: string;
  picture: string;
  logo: string;
  technos: TechnosList[];
  links?: ProjectLink[];
  year: number;
  videos: ProjectVideo[];
  type: ProjectType[];
  id: string;
  info?: string;
}
export interface Techno {
  title: string;
  logo: string;
}

export enum ProjectType {
  Site = 'Website',
  App = 'App',
  Mobile = 'Mobile',
}
