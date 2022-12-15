<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<template>
  <div class="main-container">
    <div class="img-container">
      <img :src="currentImg" />
      <div
        class="working-layer"
        :style="getWorkingLayerStyleObject"
        ref="workingLayer"
        @mousemove="drag"
        @mouseup="textDragEnd"
      >
        <div
          class="user-text"
          :class="{ isDragging: isDraggingText }"
          ref="userText"
          :style="getTextStyleObject"
          @mousedown="textDragStart"
          @mouseup="textDragEnd"
        >
          New<br />York
        </div>
        <div
          class="perspective-origin-indicator"
          :style="pOriginIndicatorStyleObject"
          ref="pOrigin"
          @mousedown="dragOriginStart"
          @mouseup="dragOriginEnd"
        ></div>
      </div>
    </div>
    <div id="control-bank">
      <div class="input-group">
        <input
          v-model="textTransforms.rotateY[0]"
          id="rotateY-control"
          name="rotateY"
          type="range"
          min="-180"
          max="180"
          step="1"
        />
        <label id="rotateY-control-label" for="rotateY"
          >RotateY (degrees):
          <span class="value-readout">{{ textTransforms.rotateY[0] }}</span>
        </label>
      </div>

      <div class="input-group">
        <input
          v-model="textTransforms.rotateX[0]"
          id="rotateX-control"
          name="rotateX"
          type="range"
          min="-180"
          max="180"
          step="1"
        />
        <label id="rotateX-control-label" for="rotateX"
          >RotateX (degrees):
          <span class="value-readout">{{ textTransforms.rotateX[0] }} </span>
        </label>
      </div>

      <div class="input-group">
        <input
          v-model="workingLayer.perspective[0]"
          id="perspective-control"
          name="perspective"
          type="range"
          min="0"
          max="1000"
          step="25"
        />
        <label id="perspective-control-label" for="perspective"
          >Perspective (pixels):
          <span class="value-readout"
            >{{ workingLayer.perspective[0] }}
          </span></label
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { imgUrls } from "./imgUrls";

// TODO: split types to separate file
type pxValuePair = [number, "px"];
type degValuePair = [number, "deg"];
type percentValuePair = [number, "%"];
type numStrPair = [number, string];
interface textStyleObject {
  top: string;
  left: string;
  transform: string;
}
interface workingLayerStyleObject {
  perspective: string;
  "perspective-origin"?: string;
}

export default defineComponent({
  name: "App",
  data() {
    return {
      images: imgUrls as string[],
      textPositioning: {
        top: [350, "px"] as pxValuePair,
        left: [70, "px"] as pxValuePair,
      },
      textTransforms: {
        rotateX: [0, "deg"] as degValuePair,
        rotateY: [0, "deg"] as degValuePair,
        translateX: [-50, "%"] as percentValuePair,
        translateY: [-50, "%"] as percentValuePair,
      },
      workingLayer: {
        perspective: [500, "px"] as pxValuePair,
        "perspective-origin": {
          x: [50, "%"] as percentValuePair,
          y: [50, "%"] as percentValuePair,
        },
      },
      isDraggingPOrigin: false,
      isDraggingText: false,
    };
  },
  computed: {
    currentImg() {
      return imgUrls[0];
    },
    getTextTransformString(): string {
      return Object.entries(this.textTransforms)
        .map(([k, v]) => `${k}(${this.reconcileUnitValues(v)})`) // could use reconcileValues method?
        .join(" ")
        .trim();
    },
    getPerspectiveOriginString(): string {
      return Object.values(this.workingLayer["perspective-origin"])
        .map((v) => this.reconcileUnitValues(v))
        .join(" ")
        .trim();
    },
    getTextStyleObject(): textStyleObject {
      const tp = this.textPositioning;
      return {
        top: this.reconcileUnitValues(tp.top),
        left: this.reconcileUnitValues(tp.left),
        transform: this.getTextTransformString,
      };
    },
    getWorkingLayerStyleObject(): workingLayerStyleObject {
      return {
        perspective: this.reconcileUnitValues(this.workingLayer.perspective),
        "perspective-origin": this.getPerspectiveOriginString,
      };
    },
    pOriginIndicatorStyleObject(): string {
      const { x, y } = this.workingLayer["perspective-origin"];
      return `top: ${this.reconcileUnitValues(
        y
      )}; left: ${this.reconcileUnitValues(x)}`;
    },
  },
  methods: {
    reconcileUnitValues(input: numStrPair | percentValuePair): string {
      return `${input[0] + input[1]}`;
    },
    textDragStart({ x, y }: MouseEvent) {
      this.isDraggingText = true;
      const { workingLayer } = this.$refs as {
        workingLayer: HTMLDivElement;
      };
      const { top: workingLayerTop, left: workingLayerLeft } =
        workingLayer.getBoundingClientRect();
      const left = x - workingLayerLeft;
      const top = y - workingLayerTop;
      this.textPositioning.left[0] = left;
      this.textPositioning.top[0] = top;
    },
    textDragEnd() {
      this.isDraggingText = false;
    },
    dragOriginStart(): void {
      this.isDraggingPOrigin = true;
    },
    drag({ x, y }: MouseEvent): void {
      const { workingLayer } = this.$refs as {
        workingLayer: HTMLDivElement;
      };
      const {
        top: workingLayerTop,
        left: workingLayerLeft,
        width: workingLayerWidth,
        height: workingLayerHeight,
      } = workingLayer.getBoundingClientRect();
      const left = x - workingLayerLeft;
      const top = y - workingLayerTop;

      if (this.isDraggingPOrigin) {
        const leftAsPercentage = (left / workingLayerWidth) * 100;
        const topAsPercentage = (top / workingLayerHeight) * 100;
        this.workingLayer["perspective-origin"].x[0] = leftAsPercentage;
        this.workingLayer["perspective-origin"].y[0] = topAsPercentage;
      } else if (this.isDraggingText) {
        this.textPositioning.left[0] = left;
        this.textPositioning.top[0] = top;
      }
    },
    dragOriginEnd() {
      this.isDraggingPOrigin = false;
    },
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&family=Roboto:ital,wght@1,500&display=swap");
* {
  box-sizing: border-box;
}

.main-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
}

.img-container {
  position: relative;
  display: flex;
  align-items: stretch;
}

#control-bank {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 0.25rem;
  flex: 0 0 200px;
}

.input-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 0.25rem;
}

.working-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.user-text {
  position: absolute;
  color: white;
  font-family: "Open Sans";
  font-weight: bold;
  line-height: 80%;
  font-size: 4.5rem;
  transform-origin: center;
  cursor: grab;
  text-rendering: geometricPrecision;
  user-select: none;
}

.user-text.isDragging {
  outline: 1px solid blueviolet;
}

.perspective-origin-indicator {
  display: inline-block;
  position: absolute;
  width: 10px;
  height: 10px;
  cursor: crosshair;
  transform: translate(-50%, -50%);
}

.perspective-origin-indicator::after {
  content: "¤";
  color: red;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
