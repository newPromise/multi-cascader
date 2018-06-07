<template lang='html'>
    <div class="popver-content">
        <div class="vk-multil-content">
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
        <muContent @handleSelect="whenSelected" v-if="activeItem && activeItem.children"  :selectedValues="selectedValues"  @handleOutPut="whenOutPut"  :option="activeItem.children" ></muContent>
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
        }
    },
    data() {
        return {
            activeItem: "",
            tempActiveItem: ""
        };
    },
    created() {
    },
    methods: {
        // 逐级上传
        whenOutPut(val) {
            this.$emit("handleOutPut", val);
        },
        // 获取到选中的值
        checkChange(item) {
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
                if (checked) {
                    this.selectedValues.push(value);
                } else {
                    this.selectedValues.splice(this.selectedValues.findIndex(val => val === value), 1);
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
            // 这里没有想到好的方法
            // 这里因为 vue.js 不能检测到更深
            this.activeItem = "";
            setTimeout(() => {
                this.activeItem = item;
            }, 10);
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
