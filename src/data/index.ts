import { shuffle } from 'lodash';
import * as projects from './projects';
import { milinusProject, profeelProject } from './projects';
import * as videos from './videos';
import * as experiences from './experience';

export * from './projects';

export const allVideos = Object.values(videos).flat();

export const allProjects = Object.values(projects);

export const allExperiences = Object.values(experiences).sort((a, b) => b.year - a.year);

export const featuredProjects = [
  projects.regleProject,
  projects.profeelProject,
  projects.milinusProject,
  projects.crecheslibProject,
  projects.nuxtTypeRouterProject,
  projects.vueChart3Project,
  projects.kazeProject,
  projects.bigupProject,
  projects.totemProject,
];

export const coverProject = milinusProject;

export const popularProject = shuffle(allProjects);
