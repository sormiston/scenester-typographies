<template>
  <div class="container">
    <div id="img-wrapper" style="perspective: 100px">
      <img :src="currentImg" />
      <span id="user-text" :style="getTextStyleObject" draggable="true"
        >New<br />York</span
      >
    </div>
    <div id="control-bank">
      <div class="input-group">
        <input
          id="rotateY-control"
          name="rotateY"
          type="range"
          min="0"
          max="360"
          step="1"
          value="0"
        />
        <label id="rotateY-control-label" for="rotateY"
          >RotateY (degrees): <span class="value-readout">0</span></label
        >
      </div>

      <div class="input-group">
        <input
          id="rotateX-control"
          name="rotateX"
          type="range"
          min="0"
          max="360"
          step="1"
          value="0"
        />
        <label id="rotateX-control-label" for="rotateX"
          >RotateX (degrees): <span class="value-readout">0</span></label
        >
      </div>

      <div class="input-group">
        <input
          id="perspective-control"
          name="perspective"
          type="range"
          min="0"
          max="500"
          step="5"
          value="0"
        />
        <label id="perspective-control-label" for="perspective"
          >Perspective (pixels): <span class="value-readout">0</span></label
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
        top: reconcileUnitValues(tp.top),
        left: reconcileUnitValues(tp.left),
        transform: this.getTextTransformString,
      };

      function reconcileUnitValues(input: numStrPair) {
        return `${input[0] + input[1]}`;
      }
      // HMM!!  Looks hard as fuck to do recursive programming with TS
      // const transformString = Object.entries(styleData.transform).reduce(
      //   (acc, [k, v]) => {
      //     return (acc + `${k}: ${v[0] + " " + v[1]}; `).trim();
      //   },
      //   ""
      // );
      // function flattenStyleData(input) {
      //   if (Array.isArray(input)) {
      //     return `${input[0]}${input[1]}`;
      //   } else {
      //     return Object.entries(input)
      //       .map(([k, v]) => `${k}(${v[0] + v[1]})`)
      //       .join(" ")
      //       .trim();
      // return Object.fromEntries(
      //   Object.entries(input).map(([k, v]) => [
      //     k,
      //     mapStyles(v as Array<number | string> | Record<string, unknown>),
      //   ])
      // );
    },
  },

  // created() {
  //   const text = document.getElementById("user-text");

  //   const imgWrapper = document.getElementById("img-wrapper");

  //   // arbitrarily preplaced dummy text
  //   text.style.top = "350px";
  //   text.style.left = "70px";

  //   // JS initialized perspectives and transforms

  //   imgWrapper.addEventListener("dragover", allowDrop);
  //   imgWrapper.addEventListener("drop", drop);

  //   function allowDrop(event) {
  //     event.preventDefault();
  //   }

  //   function drop(event) {
  //     const droppedId = event.dataTransfer.getData("text/plain");
  //     const droppedElt = document.getElementById(droppedId);
  //     const droppedEltRect = droppedElt.getBoundingClientRect();
  //     const imgWrapperRect = imgWrapper.getBoundingClientRect();
  //     const newLeft = event.x - imgWrapperRect.left - droppedEltRect.width / 2;
  //     const newTop = event.y - imgWrapperRect.top - droppedEltRect.height / 2;
  //     droppedElt.style.top = `${newTop}px`;
  //     droppedElt.style.left = `${newLeft}px`;
  //     droppedElt.style.transform = transforms;
  //   }

  //   text.addEventListener("dragstart", drag);

  //   function drag(event) {
  //     // console.log("dragstart", event);
  //     // event.target.classList.add("dragging");
  //     event.dataTransfer.setData("text/plain", event.target.id);
  //     event.dataTransfer.effectAllowed = "move";
  //   }

  //   // Controls
  //   const controls = document.getElementById("control-bank").children;

  //   for (const control of controls) {
  //     const input = control.querySelector("input");
  //     input.addEventListener("input", inputHandler);
  //   }

  //   const rotateXControl = document.querySelector("input#rotateX-control");
  //   rotateXControl.addEventListener("input", inputHandler);

  //   function inputHandler(evt) {
  //     console.log(evt.target.name);
  //     const value = evt.target.value;
  //     const label = evt.target.labels[0];
  //     const readout = label.querySelector("span.value-readout");
  //     readout.innerText = value.toString();
  //   }
  // },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&family=Roboto:ital,wght@1,500&display=swap");

.container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

#control-bank {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.input-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
}

#img-wrapper {
  position: relative;
  cursor: grab;
  perspective-origin: center;
}

#user-text {
  position: absolute;
  color: white;
  font-family: "Open Sans";
  font-weight: bold;
  line-height: 2.5rem;
  font-size: 4.5rem;
  transform-origin: center;
}

#user-text.dragging {
  color: red;
}
</style>
