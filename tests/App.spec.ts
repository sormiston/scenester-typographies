import { shallowMount } from "@vue/test-utils";
import App from "../src/App.vue";

describe("App", () => {
  test("amazing things happen", () => {
    const wrapper = shallowMount(App);
    console.log(wrapper.html());
  });
});
