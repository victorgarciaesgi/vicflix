import { Project } from '@models';
import * as projects from './projects';
import { milinusProject, profeelProject } from './projects';
import * as videos from './videos';

export * from './projects';

export const allVideos = Object.values(videos).flat();

export const allProjects = Object.values(projects);

export const coverProject = milinusProject;

export const featuredProject: Project[] = [
  projects.milinusProject,
  projects.profeelProject,
  projects.sgtsProject,
  projects.crecheslibProject,
  projects.bigupProject,
  projects.profeelProject,
  projects.crecheslibProject,
  projects.bigupProject,
  projects.milinusProject,
];

export const popularProject: Project[] = [
  projects.bigupProject,
  projects.crecheslibProject,
  projects.profeelProject,
  projects.sgtsProject,
  projects.milinusProject,
];
