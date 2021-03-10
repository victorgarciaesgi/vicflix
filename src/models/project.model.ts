import { TechnosList } from '@constants';

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
  context: ProjectContext;
}
export interface ProjectLink {
  title: string;
  link: string;
}

export interface ProgressList {
  timestamp: number;
  duration: number;
  video: ProjectVideo;
  percentage: number;
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

export interface Techno {
  title: string;
  logo: string;
}

export enum ProjectContext {
  Totem = 'Totem',
  Personal = 'Personel',
}

export enum ProjectType {
  Site = 'Website',
  App = 'App',
  Mobile = 'Mobile',
  Library = 'Library',
}
