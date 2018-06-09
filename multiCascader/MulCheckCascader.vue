<template lang='html'>
    <div class='vk-multil-cascader'>
        <el-popover placement="top-start" popper-class="vk-multi-cascader-popover" :visible-arrow="showArrow" trigger="click">
            <muContent :height="height" :width="width" :option="options" @handleOutPut="whenOutPut"></muContent>
            <el-input popper-class="slect-panel" v-if="activeItem[0] && activeItem[0].level === 0"  v-model="inputValue" readonly slot="reference"></el-input>
        </el-popover>
    </div>
</template>

<script>
import muContent from "./multiContent";
export default {
    name: "multiCascader",
    props: {
        options: {
            type: Array,
            default() {
                return [];
            }
        },
        width: {
            type: String,
            default: ""
        },
        height: {
            type: String,
            default: ""
        },
        inputValue: {
            type: String,
            default() {
                return "";
            }
        }
    },
    data() {
        return {
            showArrow: true,
            activeItem: [],
            outputValue: [],
            optionDicts: [],
            popoverStyle: {
            }
        };
    },
    components: {
        muContent
    },
    computed: {},
    created() {
        this.initData();
        this.setLevel();
        this.setOptionDicts(this.options);
    },
    methods: {
        initData() {
            this.activeItem = this.options;
            const { width, height } = this;
            this.popoverStyle = Object.assign({}, { width, height });
        },
        // 设置配置的字典
        setOptionDicts(options) {
            if (!Array.isArray(options)) {
                const { label, value } = options;
                this.optionDicts.push({ value, label });
                const children = options.children;
                if (children) {
                    this.setOptionDicts(children);
                }
            } else {
                options.forEach(opt => {
                    this.setOptionDicts(opt);
                });
            }
        },
        whenOutPut(value) {
            this.outputValue = value;
            this.$emit("on-selected", value);
        },
        // 设定层级
        setLevel() {
            if (this.options.length) {
                const addLevel = option => {
                    const optChild = option.children;
                    if (optChild) {
                        optChild.forEach(opt => {
                            opt.level = option.level + 1;
                            addLevel(opt);
                        });
                    }
                };
                this.options.forEach(option => {
                    if (!option.level) {
                        option.level = 0;
                    }
                    addLevel(option);
                });
            }
        },
        showSecondLevel(item) {
            this.activeItem = item;
        }
    }
};
</script>
<style lang='less' scoped>
.vk-menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style-type: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    outline: none;
    padding: 8px 20px;
    font-size: 14px;
    width: 100%;
    &:hover {
        background-color: rgba(125,139,169,.1);
    }
}
@import "~assets/css/variable";
</style>
