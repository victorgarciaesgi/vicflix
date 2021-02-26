import { Project } from '@models';
import * as projects from './projects';
import { milinusProject } from './projects';
import * as videos from './videos';

export const allVideos = Object.values(videos);

export const allProjects = Object.values(projects);

export const coverProject = milinusProject;

export const featuredProject: Project[] = [
  projects.milinusProject,
  projects.milinusProject,
  projects.milinusProject,
  projects.milinusProject,
  projects.milinusProject,
  projects.milinusProject,
  projects.milinusProject,
  projects.milinusProject,
];
