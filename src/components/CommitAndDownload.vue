<template>
  <div>
    <button value="commit" @click="saveWork">Save</button>
  </div>

  <teleport to="body">
    <video
      v-show="committing"
      ref="video"
      id="video-elt"
      autoplay
      @play="capture"
    />
  </teleport>
</template>

<script lang="ts">
let captureStream: MediaStream = new MediaStream();
const canvas = document.createElement("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export default {
  name: "CommitAndDownload",
  emits: ["enterPreviewMode"],
  data() {
    return {
      committing: true,
      SCALE: 1,
    };
  },
  methods: {
    async saveWork() {
      const video = this.$refs.video as HTMLVideoElement;
      try {
        captureStream = await navigator.mediaDevices.getDisplayMedia();
        video.srcObject = captureStream;
      } catch (err) {
        console.error("Error: " + err);
      }
    },
    capture() {
      try {
        const video = this.$refs.video as HTMLVideoElement;
        const dimensions = video.getBoundingClientRect();
        const { height, width } = dimensions;
        Object.assign(ctx.canvas, {
          height: height * this.SCALE,
          width: width * this.SCALE,
        });
        ctx.drawImage(video, 0, 0, width * this.SCALE, height * this.SCALE);

        captureStream.getTracks().forEach((track) => track.stop());
        this.$emit("enterPreviewMode", canvas.toDataURL("image/jpeg"));
      } catch (err) {
        console.error(err);
      } finally {
        this.committing = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#video-elt {
  position: absolute;
  height: 100vh;
  width: 100vw;
  pointer-events: none;
  z-index: 1000;
  top: 0;
  left: 0;
}

div {
  position: relative;
  max-width: fit-content;
}

a {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
