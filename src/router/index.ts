import { createRouter, createWebHistory } from "vue-router";
import PageEditor from "@/views/PageEditor.vue";

const routes = [{ path: "/editor", component: PageEditor }];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
