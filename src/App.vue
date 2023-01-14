<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<template>
  <div class="main-container">
    <div id="layer-control-bank">
      <button @click="addLayer">Add layer</button>
      <div
        v-for="(layer, index) in layers"
        :key="layer.id"
        class="layer-select-button"
        :class="{ 'active-layer': index === activeLayerIdx }"
        :data-id="layer.id"
        @click="selectActivelayer"
      >
        {{ index + 1 }}
      </div>
    </div>
    <div class="img-container">
      <img
        class="working-image"
        src="./assets/person-middle-streets-poznan-surrounded-by-old-buildings-captured-poland_181624-7908.webp"
      />
      <text-layer
        v-for="layer in layers"
        :key="layer.id"
        :id="layer.id"
        :text="layer.text"
        :textPositioning="layer.textPositioning"
        :perspectiveData="layer.perspectiveData"
        :textTransforms="layer.textTransforms"
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
          max="999"
          step="25"
        />
        <label id="perspective-control-label" for="perspective"
          >Perspective (pixels):
          <span class="value-readout"
            >{{ activeLayer.perspectiveData.perspective[0] }}
          </span></label
        >
      </div>
      <div class="input-group">
        <commit-and-download @enterPreviewMode="enterPreviewMode" />
      </div>
    </div>
  </div>
  <div v-if="jpegData" id="preview-to-download">
    <img :src="jpegData" />
    <a :href="jpegData" download="my-image.jpeg">Download</a>
    <a href="#" @click="leavePreviewMode">Go back</a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type {
  pxValuePair,
  percentValuePair,
  degValuePair,
  textLayer,
} from "@/app-types";
import { v4 as uuid } from "uuid";
import TextLayer from "@/components/TextLayer.vue";
import CommitAndDownload from "@/components/CommitAndDownload.vue";
import { imgUrls } from "./imgUrls";

export default defineComponent({
  name: "App",
  components: {
    TextLayer,
    CommitAndDownload,
  },
  data() {
    return {
      images: imgUrls as string[],
      layers: [] as textLayer[],
      activeLayerIdx: 0,
      jpegData: "",
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
    enterPreviewMode(dataUrl: string) {
      this.jpegData = dataUrl;
    },
    leavePreviewMode() {
      this.jpegData = "";
    },
    updateTextPositioning(payload: { id: string; left: number; top: number }) {
      const { id, top, left } = payload;
      const targetLayer = this.layers.find((l) => l.id === id);
      targetLayer!.textPositioning.top[0] = top;
      targetLayer!.textPositioning.left[0] = left;
    },
    updatePerspectiveData(payload: { id: string; x: number; y: number }) {
      const { id, x, y } = payload;
      const targetLayer = this.layers.find((l) => l.id === id);
      targetLayer!.perspectiveData["perspective-origin"].x[0] = x;
      targetLayer!.perspectiveData["perspective-origin"].y[0] = y;
    },
  },
  created(): void {
    const initLayer: textLayer = {
      id: uuid(),
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
      text: "Hello",
    };
    this.layers.push(initLayer);
  },
});
</script>

<style lang="scss">
@use "sass:list";
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

#layer-control-bank {
  display: flex;
  gap: 12px;
}

$COLORS: #1a1423, #372549, #774c60, #b75d69, #eacdc2;

.layer-select-button {
  width: 20px;
  height: 20px;
  text-align: center;
  color: white;

  @for $i from 1 through 5 {
    &:nth-of-type(#{$i}) {
      background-color: nth($COLORS, $i);
    }
  }

  &.active-layer {
    outline: 2px solid mediumaquamarine;
  }
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

  .value-readout {
    min-width: 3ch;
  }
}

.working-image {
  object-fit: contain;
}

#preview-to-download {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
