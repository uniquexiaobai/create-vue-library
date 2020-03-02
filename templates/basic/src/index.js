import MyComp from "./my-comp.vue";
import MyComp2 from "./my-comp2.vue";

function install(Vue) {
  Vue.component("MyComp", MyComp);
  Vue.component("MyComp2", MyComp2);
}

export default { install };

export { MyComp, MyComp2 };
