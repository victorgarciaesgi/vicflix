import { Skill, Techno } from '@models';
import { nanoid } from 'nanoid';

export enum TechnosList {
  React = 'React',
  Vue = 'Vue',
  Nuxt = 'Nuxt',
  Gatsby = 'Gatsby',
  Tailwind = 'Tailwind',
  GraphQL = 'GraphQL',
  Netlify = 'Netlify',
  Typescript = 'Typescript',
  Stripe = 'Stripe',
  MapBox = 'MapBox',
  Leaflet = 'Leaflet',
  Gitlab = 'Gitlab CI',
}

export const TechnosConstant: Skill[] = [
  { title: TechnosList.Vue, logo: 'technos/Vue.js', color: '#4fc08d', id: nanoid(4) },
  { title: TechnosList.Nuxt, logo: 'technos/Nuxt', color: '#00c58e', id: nanoid(4) },
  { title: TechnosList.Typescript, logo: 'technos/Typescript', color: '#3178c6', id: nanoid(4) },
  { title: TechnosList.GraphQL, logo: 'technos/GraphQL', color: '#e10098', id: nanoid(4) },
  { title: TechnosList.Tailwind, logo: 'technos/Tailwind', color: '#06B6D4', id: nanoid(4) },
  { title: TechnosList.React, logo: 'technos/ReactJs', color: '#61dafb', id: nanoid(4) },
  { title: TechnosList.Gatsby, logo: 'technos/Gatsby', color: '#663399', id: nanoid(4) },
  { title: TechnosList.Gitlab, logo: 'technos/GitLab', color: '#fa7035', id: nanoid(4) },
  { title: TechnosList.Netlify, logo: 'technos/Netlify', color: '#00AD9F', id: nanoid(4) },
  { title: TechnosList.Stripe, logo: 'technos/Stripe', color: '#635bff', id: nanoid(4) },
  { title: TechnosList.MapBox, logo: 'technos/Mapbox', color: '#4264fb', id: nanoid(4) },
  { title: TechnosList.Leaflet, logo: 'technos/Leaflet', color: '#199900', id: nanoid(4) },
];
