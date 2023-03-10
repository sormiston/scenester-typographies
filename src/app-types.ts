import { CSSProperties } from "vue";
export type numStrPair = [number, string];
export interface textStyleObject extends CSSProperties {
  top: string;
  left: string;
  transform: string;
}
export interface workingLayerStyleObject extends CSSProperties {
  perspective: string;
  "perspective-origin"?: string;
}

export type pxValuePair = [number, "px"];
export type degValuePair = [number, "deg"];
export type percentValuePair = [number, "%"];

export interface textPositioning {
  top: pxValuePair;
  left: pxValuePair;
}

export interface textTransforms {
  rotateX: degValuePair;
  rotateY: degValuePair;
}

export interface perspectiveData {
  perspective: pxValuePair;
  "perspective-origin": {
    x: percentValuePair;
    y: percentValuePair;
  };
}

export interface textLayer {
  textPositioning: textPositioning;
  textTransforms: textTransforms;
  perspectiveData: perspectiveData;
}
