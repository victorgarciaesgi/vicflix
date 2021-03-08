import { Project } from '@models';
import * as projects from './projects';
import { milinusProject, profeelProject } from './projects';
import * as videos from './videos';

console.log(Object.values(videos));

export const allVideos = Object.values(videos).flat();

export const allProjects = Object.values(projects);

export const coverProject = profeelProject;

export const featuredProject: Project[] = [projects.milinusProject, projects.profeelProject];
