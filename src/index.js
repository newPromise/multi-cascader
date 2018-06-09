import multiCascader from "./components";
import Vue from "vue";

const install = (Vue) => {
    Vue.component(multiCascader.name, multiCascader)
};

install(Vue);

export default { multiCascader, install };
