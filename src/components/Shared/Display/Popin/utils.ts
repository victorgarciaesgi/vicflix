import Vue from 'vue';
import { Mesure, PopupAlignement, PopupPlacement, Position, Size } from './types';

const THRESHOLD = 5;
const TRIANGLE_HEIGHT = 11;
const OFFSET = 1;
export const acceptedClonedStyles: Array<keyof Partial<CSSStyleDeclaration>> = [
  'width',
  'height',
  'flex',
  'position',
  'justifyContent',
  'alignItems',
  'alignSelf',
  'alignContent',
];
type getPopupComputedOutputMesuresArgs = {
  buttonOrigin: HTMLElement;
  popupTarget: HTMLElement;
  container?: HTMLElement | Vue;
  full: boolean;
  arrow: boolean;
  offset: number;
  placement: PopupPlacement;
  alignement?: PopupAlignement;
};
export function getPopupComputedOutputMesures(args: getPopupComputedOutputMesuresArgs) {
  const elementsMesures = getElementsMesures(args);
  const { placement, maxHeight } = getPopupPlacement({
    ...elementsMesures,
    placement: args.placement,
  });
  const alignement = getPopupAlignement({
    ...elementsMesures,
    arrow: args.arrow,
    full: args.full,
    alignement: args.alignement,
  });
  const { arrowPosition, left, top, minWidth } = getPopupCoordinatesAndSize({
    ...elementsMesures,
    placement,
    alignement,
    full: args.full,
  });
  return {
    placement,
    alignement,
    left,
    top,
    minWidth,
    maxHeight,
    arrowPosition,
  };
}

interface ElementsMesures {
  containerMesures: Mesure;
  targetOffset: number;
  popupSize: Size;
  originMesure: Mesure;
}

/** Get calculated position and mesures */
function getElementsMesures({
  buttonOrigin,
  popupTarget,
  container,
  arrow,
  full,
  offset,
}: getPopupComputedOutputMesuresArgs): ElementsMesures {
  // Button origin mesures
  let originClientRect = buttonOrigin.getBoundingClientRect();

  let originMesure: Mesure = {
    left: originClientRect.left,
    top: originClientRect.top,
    width: originClientRect.width,
    height: originClientRect.height,
  };

  // Popup target mesures
  let popupSize: Size = {
    width: popupTarget.offsetWidth,
    height: popupTarget.offsetHeight,
  };

  const getOffset = offset ?? OFFSET;

  // Misc mesures
  const targetOffset = full || !arrow ? getOffset : 10 + getOffset;

  // Container mesures
  let containerMesures: Mesure;

  if (container) {
    const parentContainer = container instanceof HTMLElement ? container : container.$el;
    const parentContainerRect = parentContainer.getBoundingClientRect();
    containerMesures = {
      left: parentContainerRect.left,
      top: parentContainerRect.top,
      width: parentContainer.clientWidth,
      height: parentContainer.clientHeight,
    };
  } else {
    containerMesures = {
      width: window.innerWidth,
      height: window.innerHeight,
      left: 0,
      top: 0,
    };
    originMesure = {
      ...originMesure,
      left: originClientRect.left,
      top: originClientRect.top,
    };
  }

  return {
    containerMesures,
    targetOffset,
    popupSize,
    originMesure,
  };
}

function getPopupPlacement({
  originMesure,
  containerMesures,
  popupSize,
  targetOffset,
  placement: preferedPlacement,
}: ElementsMesures & { placement: PopupPlacement }): {
  placement: PopupPlacement;
  maxHeight: number;
} {
  const originBottomPosition = originMesure.height + (originMesure.top - containerMesures.top);
  // const totalHeightFromTop = originBottomPosition + popupSize.height + targetOffset;
  // const totalHeightFromBottom =
  //   containerMesures.height - originMesure.top + popupSize.height + targetOffset;
  let maxHeight: number;
  let placement: PopupPlacement;

  const spaceBottom = containerMesures.height - originBottomPosition - targetOffset - THRESHOLD;
  const spaceTop = originMesure.top - containerMesures.top - targetOffset + THRESHOLD;

  if (spaceBottom >= spaceTop) {
    placement = PopupPlacement.Bottom;
    maxHeight = spaceBottom;
  } else {
    placement = PopupPlacement.Top;
    maxHeight = spaceTop;
  }

  if (maxHeight > 450) maxHeight = 450;

  return { placement, maxHeight };
}

function getPopupAlignement({
  originMesure,
  containerMesures,
  popupSize,
  targetOffset,
  arrow,
  alignement,
  full,
}: ElementsMesures & {
  arrow: boolean;
  full: boolean;
  alignement?: PopupAlignement;
}): PopupAlignement {
  let processedAlignement!: PopupAlignement;
  const popupCenteredPosition = originMesure.left + originMesure.width / 2 - popupSize.width / 2;

  if (full || popupSize.width > containerMesures.width) {
    processedAlignement = PopupAlignement.Full;
  } else if (alignement) {
    processedAlignement = alignement;
  } else if (
    popupCenteredPosition > containerMesures.left + THRESHOLD &&
    popupCenteredPosition + popupSize.width + THRESHOLD <
      containerMesures.left + containerMesures.width
  ) {
    processedAlignement = PopupAlignement.Center;
  } else if (
    originMesure.left + popupSize.width <
    containerMesures.left + containerMesures.width + THRESHOLD
  ) {
    processedAlignement = PopupAlignement.Start;
  } else if (
    containerMesures.left + THRESHOLD + popupSize.width <
    containerMesures.left + containerMesures.width
  ) {
    processedAlignement = PopupAlignement.ContainerStart;
  } else if (
    originMesure.left + originMesure.width - popupSize.width >
    containerMesures.left + THRESHOLD
  ) {
    processedAlignement = PopupAlignement.End;
  } else if (
    containerMesures.left + containerMesures.width - popupSize.width + THRESHOLD <
    containerMesures.left
  ) {
    processedAlignement = PopupAlignement.ContainerEnd;
  } else {
    processedAlignement = PopupAlignement.Full;
  }
  return processedAlignement;
}

interface getPopupCoordinatesAndSize {
  placement: PopupPlacement;
  alignement: PopupAlignement;
  containerMesures: Mesure;
  targetOffset: number;
  popupSize: Size;
  originMesure: Mesure;
  full: boolean;
}
function getPopupCoordinatesAndSize({
  originMesure,
  containerMesures,
  popupSize,
  targetOffset,
  placement,
  alignement,
  full,
}: getPopupCoordinatesAndSize): {
  left: string;
  top: string;
  minWidth: number | null;
  arrowPosition: string;
} {
  const popupFinalWidth = full ? originMesure.width : null;

  let outputLeft: number;
  let outputTop: number;

  if (full || alignement === PopupAlignement.Full) {
    outputLeft = originMesure.left;
  } else if (alignement === PopupAlignement.End) {
    outputLeft = originMesure.left + originMesure.width - popupSize.width;
  } else if (alignement === PopupAlignement.ContainerEnd) {
    outputLeft = containerMesures.left + containerMesures.width + THRESHOLD;
  } else if (alignement === PopupAlignement.Start) {
    outputLeft = originMesure.left;
  } else if (alignement === PopupAlignement.ContainerStart) {
    outputLeft = containerMesures.left + THRESHOLD;
  } else {
    outputLeft = originMesure.left - popupSize.width / 2 + originMesure.width / 2;
  }
  if (placement === PopupPlacement.Top) {
    outputTop = originMesure.top - targetOffset - popupSize.height;
  } else {
    outputTop = originMesure.top + originMesure.height + targetOffset;
  }

  let arrowPosition =
    originMesure.left - outputLeft + originMesure.width / 2 - TRIANGLE_HEIGHT + 'px';

  return {
    left: outputLeft + 'px',
    top: outputTop + 'px',
    minWidth: popupFinalWidth,
    arrowPosition,
  };
}

export function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  if (node == null) return null;
  if (node.scrollHeight > node.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentElement);
  }
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//

export function calculatePopupPosition(
  origin: HTMLElement,
  target: HTMLElement,
  Types: {
    XType: 'left' | 'right' | 'center' | 'fill';
    YType: 'bottom' | 'top';
    maxHeight: number;
  },
  selectMode: boolean,
  noIndicator?: boolean
) {
  const originWidth: number = origin.clientWidth;
  const originHeight: number = origin.offsetHeight;
  const targetOffset = selectMode || noIndicator ? 0 : 15;

  const viewportOffset = origin.getBoundingClientRect();
  const position = {
    left: viewportOffset.left,
    top: viewportOffset.top,
  };
  const popupWidth = selectMode ? originWidth : target.offsetWidth;
  let outputLeft: number | string = position.left + originWidth / 2 - popupWidth / 2;
  let outputTop: number | string = position.top + originHeight;
  let outputBottom: number | string = 'none';
  const windowWidth: number = window.innerWidth;

  if (selectMode) {
    outputLeft = position.left;
  } else if (Types.XType === 'right') {
    outputLeft = windowWidth - popupWidth + 15;
  } else if (Types.XType === 'left') {
    outputLeft = 10;
  } else if (Types.XType === 'fill') {
    outputLeft = 10;
  }
  if (Types.YType === 'top') {
    outputTop = 'none';
    outputBottom = window.innerHeight - position.top + targetOffset + 'px';
  } else if (Types.YType === 'bottom') {
    outputTop = outputTop + targetOffset + 'px';
  }
  const triangleLeft = position.left - outputLeft + originWidth / 2 - 13 + 'px';

  return {
    left: outputLeft + 'px',
    top: outputTop,
    bottom: outputBottom,
    width: originWidth + 'px',
    triangleLeft,
  };
}

export function calculatePopupRelativePosition(
  origin: HTMLElement,
  target: HTMLElement,
  selectMode?: boolean,
  container?: HTMLElement | Vue,
  noIndicator?: boolean
) {
  const originWidth: number = origin.offsetWidth;
  const originHeight: number = origin.offsetHeight;
  const viewportOffset = origin.getBoundingClientRect();
  const targetOffset = selectMode || noIndicator ? 2 : 15;
  let OriginPosition = {
    left: viewportOffset.left,
    top: viewportOffset.top,
  };
  const popupWidth: number = target.offsetWidth;
  const popupHeight: number = target.offsetHeight;
  let containerWidth: number;
  let containerHeight: number;
  let containerPosition;
  let outputLeft: any;
  let outputTop: any;
  if (container) {
    let finalContainer: Element;
    if (!(container instanceof HTMLElement)) {
      finalContainer = container.$el;
    } else {
      finalContainer = container;
    }
    containerWidth = finalContainer.clientWidth;
    containerHeight = finalContainer.clientHeight;
    containerPosition = {
      left: Math.round(finalContainer.getBoundingClientRect().left),
      top: Math.round(finalContainer.getBoundingClientRect().top),
    };

    OriginPosition = {
      left: OriginPosition.left - containerPosition.left,
      top: OriginPosition.top - containerPosition.top,
    };
  } else {
    containerWidth = window.innerWidth;
    containerHeight = window.innerHeight;
    containerPosition = { left: 0, top: 0 };
    OriginPosition = {
      left: Math.round(viewportOffset.left),
      top: Math.round(viewportOffset.top),
    };
  }

  outputLeft = OriginPosition.left + originWidth / 2 - popupWidth / 2;
  outputTop = OriginPosition.top + originHeight + targetOffset;

  let XType;
  let YType;

  // check left and right
  if (popupWidth + targetOffset > containerWidth) {
    XType = 'fill';
  } else if (outputLeft + popupWidth > containerWidth - targetOffset) {
    XType = 'right';
  } else if (outputLeft < targetOffset) {
    XType = 'left';
  } else if (noIndicator) {
    if (OriginPosition.left < containerWidth / 2) {
      XType = 'left';
    } else {
      XType = 'right';
    }
  } else {
    XType = 'center';
  }

  // check top and bottom

  const topMargin = outputTop + popupHeight + targetOffset;
  const bottomMargin = containerHeight - OriginPosition.top + popupHeight + targetOffset;
  let maxHeight: number;

  if (topMargin < containerHeight) {
    YType = 'bottom';
    maxHeight = containerHeight - outputTop - targetOffset - 10;
  } else if (bottomMargin < containerHeight) {
    YType = 'top';
    maxHeight = containerHeight - (containerHeight - OriginPosition.top) - targetOffset - 10;
  } else if (
    containerHeight - outputTop >
    containerHeight - (containerHeight - OriginPosition.top)
  ) {
    YType = 'bottom';
    maxHeight = containerHeight - outputTop - targetOffset - 10;
  } else {
    YType = 'top';
    maxHeight = containerHeight - (containerHeight - OriginPosition.top) - targetOffset * 2 - 10;
  }
  if (maxHeight > 450) maxHeight = 450;
  return { XType, YType, maxHeight };
}
