import multiCascader from "./components";

const install = (Vue) => {
    Vue.component(multiCascader.name, multiCascader)
};

export default { multiCascader, install };
