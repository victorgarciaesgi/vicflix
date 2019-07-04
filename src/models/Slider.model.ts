export interface ISlideItem {
  id: number;
  title: string;
  image: string;
  technos?: ITechno[];
  description?: string;
  type: ISlideType;
}

export type ITechno = 'Vue' | 'Graphql' | 'Typescript' | 'Stripe' | 'MapBox' | 'PWA';
export type ISlideType = 'Work Project' | 'Skill' | 'About' | 'Experience';
