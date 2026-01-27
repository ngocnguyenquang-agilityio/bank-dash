import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import ResizeObserver from "resize-observer-polyfill";

global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

global.ResizeObserver = ResizeObserver;

// Override getBoundingClientRect to return non-zero dimensions in JSDOM
Element.prototype.getBoundingClientRect = function () {
  const style = (this as HTMLElement).style;
  const width = parseInt(style?.width, 10) || 800;
  const height = parseInt(style?.height, 10) || 600;

  return {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON: () => "",
  } as DOMRect;
};
