export enum PopupPlacement {
  Bottom = 'Bottom',
  Top = 'Top',
}

export enum PopupAlignement {
  Center = 'Center',
  Start = 'Start',
  ContainerFull = 'ContainerFull',
  ContainerStart = 'ContainerStart',
  ContainerEnd = 'ContainerEnd',
  OriginStart = 'OriginStart',
  OriginEnd = 'OriginEnd',
  OriginFull = 'OriginFull',
  End = 'End',
  Full = 'Full',
}

export type Position = {
  left: number;
  top: number;
};

export enum PopupMode {
  Click = 'click',
  Hover = 'hover',
  Manual = 'manual',
}

export interface Size {
  width: number;
  height: number;
}

export type Mesure = Position & Size;
