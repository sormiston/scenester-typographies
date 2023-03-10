<template>
  <div class="main-container">
    <div class="img-container">
      <img class="working-image" :src="currentImg" />
      <text-layer
        :textPositioning="activeLayer.textPositioning"
        :perspectiveData="activeLayer.perspectiveData"
        :textTransforms="activeLayer.textTransforms"
        @update:textPositioning="updateTextPositioning"
        @update:perspectiveData="updatePerspectiveData"
      />
    </div>

    <div id="control-bank">
      <div class="input-group">
        <input
          v-model="activeLayer.textTransforms.rotateY[0]"
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
            activeLayer.textTransforms.rotateY[0]
          }}</span>
        </label>
      </div>

      <div class="input-group">
        <input
          v-model="activeLayer.textTransforms.rotateX[0]"
          id="rotateX-control"
          name="rotateX"
          type="range"
          min="-180"
          max="180"
          step="1"
        />
        <label id="rotateX-control-label" for="rotateX"
          >RotateX (degrees):
          <span class="value-readout"
            >{{ activeLayer.textTransforms.rotateX[0] }}
          </span>
        </label>
      </div>

      <div class="input-group">
        <input
          v-model="activeLayer.perspectiveData.perspective[0]"
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
            >{{ activeLayer.perspectiveData.perspective[0] }}
          </span></label
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type {
  pxValuePair,
  degValuePair,
  percentValuePair,
  textLayer,
} from "@/app-types";
import TextLayer from "@/components/TextLayer.vue";
import { imgUrls } from "@/imgUrls";

export default defineComponent({
  name: "PageEditor",
  components: {
    TextLayer,
  },
  data() {
    return {
      images: imgUrls as string[],
      layers: [] as textLayer[],
      activeLayerIdx: 0,
    };
  },
  computed: {
    currentImg() {
      return imgUrls[0];
    },
    activeLayer(): textLayer {
      return this.layers[this.activeLayerIdx];
    },
  },
  methods: {
    updateTextPositioning(payload: { left: number; top: number }) {
      const { top, left } = payload;
      this.activeLayer.textPositioning.top[0] = top;
      this.activeLayer.textPositioning.left[0] = left;
    },
    updatePerspectiveData(payload: { x: number; y: number }) {
      const { x, y } = payload;
      this.activeLayer.perspectiveData["perspective-origin"].x[0] = x;
      this.activeLayer.perspectiveData["perspective-origin"].y[0] = y;
    },
  },
  created(): void {
    const initLayer: textLayer = {
      textPositioning: {
        top: [350, "px"] as pxValuePair,
        left: [70, "px"] as pxValuePair,
      },
      textTransforms: {
        rotateX: [0, "deg"] as degValuePair,
        rotateY: [0, "deg"] as degValuePair,
      },
      perspectiveData: {
        perspective: [500, "px"] as pxValuePair,
        "perspective-origin": {
          x: [50, "%"] as percentValuePair,
          y: [50, "%"] as percentValuePair,
        },
      },
    };
    this.layers.push(initLayer);
  },
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&family=Roboto:ital,wght@1,500&display=swap");
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  position: relative;
  width: 100vw;
}

$lg: "955px";

.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  width: 100%;
  flex-direction: column;

  @media screen and (min-width: $lg) {
    flex-direction: row;
  }
}

.img-container {
  position: relative;
  display: flex;
  align-items: stretch;
  margin: 12px;
}

#control-bank {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0 0.25rem;

  @media screen and (min-width: $lg) {
    flex-direction: column;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 0.25rem;
  max-width: 200px;
}

.working-image {
  object-fit: contain;
}
</style>
