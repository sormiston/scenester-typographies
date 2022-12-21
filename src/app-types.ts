export type numStrPair = [number, string];
export interface textStyleObject {
  top: string;
  left: string;
  transform: string;
}
export interface workingLayerStyleObject {
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
  id: string;
  textPositioning: textPositioning;
  textTransforms: textTransforms;
  perspectiveData: perspectiveData;
  text: string;
}
