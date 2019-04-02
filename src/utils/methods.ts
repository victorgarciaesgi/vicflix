export function timeout(duration: number): Promise<{}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max + min);
}

export function calculatePopupPosition(
  origin: HTMLElement,
  target: HTMLElement,
  Types: { XType: 'left' | 'right' | 'center' | 'fill'; YType: 'bottom' | 'top'; maxHeight: number }
) {
  const originWidth: number = origin.offsetWidth;
  const originHeight: number = origin.offsetHeight;
  const viewportOffset = origin.getBoundingClientRect();
  const position = {
    left: Math.round(viewportOffset.left),
    top: Math.round(viewportOffset.top),
  };
  const popupWidth = target.offsetWidth;
  const popupHeight = target.offsetHeight;
  let outputLeft: number | string = position.left + originWidth / 2 - popupWidth / 2;
  let outputTop: number | string = position.top + originHeight;
  let outputBottom: number | string = 'none';
  const windowWidth: number = window.innerWidth;

  if (Types.XType === 'right') {
    outputLeft = windowWidth - popupWidth - 15;
  } else if (Types.XType === 'left') {
    outputLeft = 5;
  }
  if (Types.YType === 'top') {
    outputTop = 'none';
    outputBottom = window.innerHeight - position.top + 15 + 'px';
  } else if (Types.YType === 'bottom') {
    outputTop = outputTop + 15 + 'px';
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
  container?: HTMLElement
) {
  const originWidth: number = origin.offsetWidth;
  const originHeight: number = origin.clientHeight;
  const viewportOffset = origin.getBoundingClientRect();
  const targetOffset = selectMode ? 2 : 15;
  let OriginPosition = {
    left: Math.round(viewportOffset.left),
    top: Math.round(viewportOffset.top),
  };
  const popupWidth: number = target.offsetWidth;
  const popupHeight: number = target.offsetHeight;
  let containerWidth: number;
  let containerHeight: number;
  let containerPosition;
  let outputLeft: any;
  let outputTop: any;
  if (container) {
    containerWidth = container.offsetWidth;
    containerHeight = container.offsetHeight;
    containerPosition = {
      left: Math.round(container.getBoundingClientRect().left),
      top: Math.round(container.getBoundingClientRect().top),
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
  } else {
    XType = 'center';
  }

  // check top and bottom

  const topMargin = outputTop + popupHeight + targetOffset;
  const bottomMargin = containerHeight - OriginPosition.top + popupHeight + targetOffset;
  let maxHeight: number;

  if (topMargin < containerHeight) {
    YType = 'bottom';
    maxHeight = containerHeight - outputTop - targetOffset;
  } else if (bottomMargin < containerHeight) {
    YType = 'top';
    maxHeight = containerHeight - (containerHeight - OriginPosition.top) - targetOffset;
  } else {
    if (containerHeight - outputTop > containerHeight - (containerHeight - OriginPosition.top)) {
      YType = 'bottom';
      maxHeight = containerHeight - outputTop - targetOffset;
    } else {
      YType = 'top';
      maxHeight = containerHeight - (containerHeight - OriginPosition.top) - targetOffset * 2;
    }
  }
  return { XType, YType, maxHeight };
}
