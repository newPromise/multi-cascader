<template lang="html">
    <div class="popver-content">
        <div class="vk-multil-content" :style="contentStyle">
            <ul class="vk-multi-menu">
                <li class="vk-menu-item" v-for="(item, index) of option"
                    :key="index"
                    @click="showNextLevel(item)">
                    <el-checkbox v-model="item.checked" @change="checkChange(item)">{{ item.label }}</el-checkbox>
                    <i class="el-icon-arrow-right" v-show="item.children && item.children.length > 0"></i>
                </li>
            </ul>
        </div>
        <!-- 递归调用自身组件 -->
        <muContent
            @handleSelect="whenSelected"
            :height="height"
            :width="width"
            v-if="(activeItem && activeItem.children) && (activeItem.children.length > 0)"
            :selectedValues="selectedValues"
            @handleOutPut="whenOutPut"
            :option="activeItem.children" >
        </muContent>
    </div>
</template>

<script>
export default {
    name: "muContent",
    props: {
        option: {
            type: Array,
            default() {
                return [];
            }
        },
        selectedValues: {
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
        }
    },
    data() {
        return {
            activeItem: "",
            tempActiveItem: "",
            contentStyle: {
                width: "",
                height: ""
            }
        };
    },
    created() {
        this.initData();
    },
    methods: {
        // 逐级上传
        whenOutPut(val) {
            this.$emit("handleOutPut", val);
        },
        initData() {
            const { width, height } = this;
            this.contentStyle = Object.assign(this.contentStyle, { width, height });
        },
        // 获取到选中的值
        checkChange(item) {
            const that = this;
            if (!item.children || item.children.length === 0) {
                if (this.selectedValues.includes(item.value)) {
                    const index = this.selectedValues.indexOf(item.value);
                    this.selectedValues.splice(index, 1);
                } else {
                    this.selectedValues.push(item.value);
                }
            }
            const setChecked = toCheckItem => {
                toCheckItem.checked = item.checked;
                const { value, checked } = toCheckItem;
                const getValIndex = this.selectedValues.findIndex(val => val === value);
                if (checked) {
                    this.selectedValues.push(value);
                } else if (getValIndex >= 0) {
                    this.selectedValues.splice(getValIndex, 1);
                }
                const itemChild = toCheckItem.children;
                if (itemChild && itemChild.length > 0) {
                    itemChild.forEach(child => {
                        setChecked(child);
                    });
                }
            };
            // 当一级菜单改变的时候
            if (item.children) {
                item.children.forEach(child => setChecked(child));
            }
            this.activeItem = item;
            this.$emit("handleSelect", this.option);
            this.$emit("handleOutPut", this.selectedValues);
        },
        whenSelected(val) {
            let hasCheckTrue = true;
            if (Array.isArray(val) && val.length > 0) {
                hasCheckTrue = val.every(child => child.checked === false);
            }
            if (hasCheckTrue) {
                this.activeItem.checked = false;
            } else {
                this.activeItem.checked = true;
            }
        },
        showNextLevel(item) {
            this.activeItem = item;
        }
    }
};
</script>
<style lang='less' scoped>
.popver-content {
    display: flex;
    justify-content: space-between;
}
.vk-multil-content {
    width: 220px;
    height: 240px;
    display: inline-block;
    overflow: auto;
}
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
</style>
