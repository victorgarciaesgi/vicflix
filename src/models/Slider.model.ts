export interface ISlideItem {
  id: number;
  title: string;
  image: string;
  technos?: ITechno[];
  description?: string;
  type: ISlideType;
}

export type ITechno = 'Vue' | 'Graphql' | 'Typescript' | 'Stripe';
export type ISlideType = 'Project' | 'Skill' | 'About' | 'Experience';
