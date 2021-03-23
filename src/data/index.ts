import { Project } from '@models';
import { shuffle } from 'lodash';
import * as projects from './projects';
import { milinusProject, profeelProject } from './projects';
import * as videos from './videos';

export * from './projects';

export const allVideos = Object.values(videos).flat();

export const allProjects = Object.values(projects);

export const coverProject = milinusProject;

export const popularProject = shuffle(allProjects);
