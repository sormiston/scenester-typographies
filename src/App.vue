<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<template>
  <div class="main-container">
    <div class="img-container">
      <img :src="currentImg" />
      <div
        class="working-layer"
        :style="getImgWrapperStyleObject"
        ref="workingLayer"
        @dragover="allowDrop"
        @drop="drop"
      >
        <div
          class="user-text"
          :class="{ isDragging }"
          ref="userText"
          :style="getTextStyleObject"
          draggable="true"
          @dragstart="drag"
          @mousedown="mousedown"
        >
          New<br />York
        </div>
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
          <span class="value-readout">{{
            textTransforms.rotateY[0]
          }}</span></label
        >
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
          <span class="value-readout">{{
            textTransforms.rotateX[0]
          }}</span></label
        >
      </div>

      <div class="input-group">
        <input
          v-model="imgWrapper.perspective[0]"
          id="perspective-control"
          name="perspective"
          type="range"
          min="0"
          max="500"
          step="5"
        />
        <label id="perspective-control-label" for="perspective"
          >Perspective (pixels):
          <span class="value-readout">{{
            imgWrapper.perspective[0]
          }}</span></label
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
type numStrPair = [number, string];
interface textStyleObject {
  top: string;
  left: string;
  transform: string;
}
interface imgWrapperStyleObject {
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
        scaleX: [1, ""] as numStrPair,
        scaleY: [1, ""] as numStrPair,
      },
      imgWrapper: {
        perspective: [100, "px"] as pxValuePair,
        "perspective-origin": "left top",
      },
      isDragging: false,
      isPerspectiveZeroed: false,
      dragOffset: {
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    currentImg() {
      return imgUrls[0];
    },
    getTextTransformString(): string {
      return Object.entries(this.textTransforms)
        .map(([k, v]) => `${k}(${v[0] + v[1]})`)
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
    getImgWrapperStyleObject(): imgWrapperStyleObject {
      if (this.isPerspectiveZeroed) {
        return { perspective: this.reconcileUnitValues([9999, "px"]) };
      }
      return {
        perspective: this.reconcileUnitValues(this.imgWrapper.perspective),
        "perspective-origin": this.imgWrapper["perspective-origin"],
      };
    },
  },
  methods: {
    reconcileUnitValues(input: numStrPair): string {
      return `${input[0] + input[1]}`;
    },
    allowDrop(evt: DragEvent) {
      evt.preventDefault();
    },
    drag(evt: DragEvent) {
      this.isDragging = true;
      const { userText } = this.$refs as { userText: HTMLDivElement };
      console.log(
        "mouse x in userText:",
        evt.x - userText.getBoundingClientRect().left
      );
      console.log(
        "mouse y in userText",
        evt.y - userText.getBoundingClientRect().top
      );
      this.dragOffset.x = evt.x - userText.getBoundingClientRect().left;
      this.dragOffset.y = evt.y - userText.getBoundingClientRect().top;
    },
    drop(evt: DragEvent) {
      const { workingLayer, userText } = this.$refs as {
        workingLayer: HTMLDivElement;
        userText: HTMLDivElement;
      };
      const workingLayerRect = workingLayer.getBoundingClientRect();
      // const userTextRect = userText.getBoundingClientRect();

      this.textPositioning.top[0] =
        evt.y - workingLayerRect.top - this.dragOffset.y;
      this.textPositioning.left[0] =
        evt.x - workingLayerRect.left - this.dragOffset.x;

      this.isDragging = false;
      this.isPerspectiveZeroed = false;
    },
    mousedown() {
      console.log("mousedown!");
      this.isPerspectiveZeroed = true;
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
  cursor: grab;
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
}

.user-text.isDragging {
  color: red;
  overflow: visible;
  z-index: 1;
}
</style>
