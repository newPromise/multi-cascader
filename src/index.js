import multiCascader from "./components";
import Vue from "vue";

const install = () => {
    Vue.component(multiCascader.name, multiCascader)
};

export default multiCascader;
