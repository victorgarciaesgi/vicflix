export interface BaseInfo {
  title: string;
  description: string;
  picture: string;
  logo: string;
}
export interface Techno {
  title: string;
  logo: string;
}

export interface Project extends BaseInfo {
  technos: Techno[];
}
