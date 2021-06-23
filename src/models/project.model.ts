import { TechnosList } from '@constants';

export interface BaseItemInterface {
  id: string;
  logo: string;
  title: any;
}

//! Project
export interface Project extends BaseItemInterface {
  slogan?: string;
  description: string;
  placeholder: string;
  picture: string;
  logo: string;
  technos: TechnosList[];
  links?: ProjectLink[];
  year: number;
  duration?: number;
  videos: ProjectVideo[];
  type: ProjectType[];
  info?: string;
  context: ProjectContext;
  title: string;
  badges?: {
    link?: string;
    img: string;
  }[];
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
  id: string;
  season: number;
  projectId: string;
  videoUrl: string;
  thumbnail: string;
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

//! Skill

export interface Skill extends BaseItemInterface {
  color: string;
  title: TechnosList;
}

//! Experience

export enum ExperienceType {
  'Job' = 'Job',
  'Studies' = 'Studies',
}
