<template>
  <div
    class="working-layer"
    :style="getWorkingLayerStyleObject"
    ref="workingLayer"
    @mousemove="drag"
    @mouseup="textDragEnd"
    @touchmove="drag"
  >
    <div
      class="user-text"
      :class="{ isDragging: isDraggingText }"
      ref="userText"
      :style="getTextStyleObject"
      @mousedown="textDragStart"
      @mouseup="textDragEnd"
      @touchstart="textDragStart"
      @touchend="textDragEnd"
    >
      New<br />York
    </div>
    <div
      class="perspective-origin-indicator"
      :style="pOriginIndicatorStyleObject"
      ref="pOrigin"
      @mousedown="dragOriginStart"
      @mouseup="dragOriginEnd"
      @touchstart="dragOriginStart"
      @touchend="dragOriginEnd"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type {
  workingLayerStyleObject,
  numStrPair,
  percentValuePair,
  textStyleObject,
  textTransforms,
  textPositioning,
  perspectiveData,
} from "@/app-types";

export default defineComponent({
  name: "TextLayer",
  props: {
    textPositioning: {
      type: Object as PropType<textPositioning>,
      required: true,
    },
    textTransforms: {
      type: Object as PropType<textTransforms>,
      required: true,
    },
    perspectiveData: {
      type: Object as PropType<perspectiveData>,
      required: true,
    },
  },
  data() {
    return {
      isDraggingPOrigin: false,
      isDraggingText: false,
    };
  },
  computed: {
    getWorkingLayerStyleObject(): workingLayerStyleObject {
      return {
        perspective: this.reconcileUnitValues(this.perspectiveData.perspective),
        "perspective-origin": this.getPerspectiveOriginString,
      };
    },
    getTextTransformString(): string {
      return Object.entries(this.textTransforms)
        .map(([k, v]) => `${k}(${this.reconcileUnitValues(v)})`) // could use reconcileValues method?
        .join(" ")
        .trim();
    },
    getPerspectiveOriginString(): string {
      return Object.values(this.perspectiveData["perspective-origin"])
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

    pOriginIndicatorStyleObject(): string {
      const { x, y } = this.perspectiveData["perspective-origin"];
      return `top: ${this.reconcileUnitValues(
        y
      )}; left: ${this.reconcileUnitValues(x)}`;
    },
  },
  methods: {
    reconcileUnitValues(input: numStrPair | percentValuePair): string {
      return `${input[0] + input[1]}`;
    },
    drag(evt: MouseEvent | TouchEvent): void {
      evt.preventDefault();
      const { workingLayer } = this.$refs as {
        workingLayer: HTMLDivElement;
      };
      const {
        top: workingLayerTop,
        left: workingLayerLeft,
        width: workingLayerWidth,
        height: workingLayerHeight,
      } = workingLayer.getBoundingClientRect();

      const { x, y } = this.getCoordsFromTouchOrMouse(evt);

      const left = x - workingLayerLeft;
      const top = y - workingLayerTop;

      if (this.isDraggingPOrigin) {
        const leftAsPercentage = (left / workingLayerWidth) * 100;
        const topAsPercentage = (top / workingLayerHeight) * 100;
        this.$emit("update:perspectiveData", {
          x: leftAsPercentage,
          y: topAsPercentage,
        });
      } else if (this.isDraggingText) {
        const userText = this.$refs.userText as HTMLDivElement;
        const { width, height } = userText.getBoundingClientRect();
        this.$emit("update:textPositioning", {
          left: left - width / 2,
          top: top - height / 2,
        });
      }
    },
    textDragStart(evt: MouseEvent | TouchEvent) {
      evt.preventDefault();
      this.isDraggingText = true;
      const { workingLayer } = this.$refs as {
        workingLayer: HTMLDivElement;
      };
      const { top: workingLayerTop, left: workingLayerLeft } =
        workingLayer.getBoundingClientRect();

      const { x, y } = this.getCoordsFromTouchOrMouse(evt);

      const userText = this.$refs.userText as HTMLDivElement;
      const { width, height } = userText.getBoundingClientRect();
      const left = x - workingLayerLeft;
      const top = y - workingLayerTop;

      this.$emit("update:textPositioning", {
        left: left - width / 2,
        top: top - height / 2,
      });
    },
    textDragEnd(evt: MouseEvent | TouchEvent) {
      evt.preventDefault();
      this.isDraggingText = false;
    },
    dragOriginStart(evt: MouseEvent | TouchEvent): void {
      evt.preventDefault();
      this.isDraggingPOrigin = true;
    },

    dragOriginEnd(evt: MouseEvent | TouchEvent) {
      evt.preventDefault();
      this.isDraggingPOrigin = false;
    },

    getCoordsFromTouchOrMouse(evt: MouseEvent | TouchEvent): {
      x: number;
      y: number;
    } {
      let x, y;
      if (evt instanceof MouseEvent) {
        x = evt.x;
        y = evt.y;
      } else {
        // is a touch event
        const { targetTouches } = evt;
        x = targetTouches[0].clientX;
        y = targetTouches[0].clientY;
      }
      return { x, y };
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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
  outline: 3px solid blueviolet;
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
