<template lang="html">
    <div class="popver-content">
        <div class="multiCascader-multil-content" :style="contentStyle">
            <ul class="multiCascader-multi-menu">
                <li v-for="(item, index) of option"
                    :key="index"
                    :class="[ 'multiCascader-menu-item', { 'item-disabled': item.disabled }]"
                    @click="showNextLevel(item)">
                    <el-checkbox :disabled="item.disabled" v-model="item.checked" @change="checkChange(item)">{{ item.label }}</el-checkbox>
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
            :disabledPair="disabledPair"
            :option="activeItem.children" >
        </muContent>
    </div>
</template>

<script>
const vm = this;
import Vue from "vue";
export default {
    name: "muContent",
    props: {
        option: {
            type: Array,
            default() {
                return [];
            }
        },
        // 被选中的值
        selectedValues: {
            type: Array,
            default() {
                return [];
            }
        },
        // 设置的宽度
        width: {
            type: String,
            default: ""
        },
        height: {
            type: String,
            default: ""
        },
        // 禁用字段
        disabledPair: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            activeItem: "",
            tempActiveItem: "",
            contentStyle: {
                width: "",
                height: ""
            },
            checkArr: [],
            checkDisabled: false
        };
    },
    created() {
        this.initData();
        this.whenOutPut(this.selectedValues);
    },
    methods: {
        // 逐级上传
        whenOutPut(val) {
            this.$emit("handleOutPut", val);
        },
        initData() {
            const { width, height } = this;
            this.contentStyle = Object.assign({}, this.contentStyle, { width, height });
        },
        // 获取到选中的值
        checkChange(item) {
            const getCheckedItems = item => {
                const { value, checked, level } = item;
                if (checked && level) {
                    this.selectedValues.push(value);
                } else if (!checked) {
                    item.disabled = false;
                    if (this.selectedValues.includes(value)) {
                        this.selectedValues.splice(this.selectedValues.findIndex(slectVal => slectVal === value), 1);
                    }
                }
                const itemChild = item.children;
                if (itemChild) {
                    itemChild.forEach(child => child.checked = checked);
                }
            };
            
            this.recursiveFn(item, getCheckedItems);
            this.disabeldAction(item);
            this.activeItem = item;
            this.$emit("handleSelect", this.option);
            this.$emit("handleOutPut", this.selectedValues);
        },
        // 当二级菜单改变的时候
        whenSelected(val) {
            let allChildCancelChecked = true;
            if (Array.isArray(val) && val.length > 0) {
                allChildCancelChecked = val.every(child => child.checked === false);
            }
            this.activeItem.checked = !allChildCancelChecked;
            this.disabeldAction(this.activeItem);
            this.$emit("handleSelect", this.option);
        },
        // 递归函数
        recursiveFn(curItem, cb) {
            cb(curItem);
            const children = curItem.children;
            if (children && children.length > 0) {
                children.forEach(item => {
                    this.recursiveFn(item, cb);
                });
            }
        },
        // 设置 disabled 值 values: 互斥的另一方数组， curItem 当前选中的值
        setDisabled(exceptValues, curItem, values) {
            const { checked: curChecked, childrenValues, value: curValue, siblingValues } = curItem;
            this.checkArr = [];
            if (values.includes("all")) {
                if (siblingValues) {
                    this.checkArr = new Array(siblingValues.length - exceptValues.length).fill(true);
                }
            } else {
                this.checkArr = new Array(values.length).fill(true);
            }
            const getCheckArr = item => {
                const { value, checked } = item;
                if (!exceptValues.includes(value)) return;
                this.checkArr.push(checked);
                this.checkArr.shift();          
            };
            const resetDistable = (child) => {
                if (!values.includes(child.value)) return;
                child.disabled = this.checkArr.some(val => val === true);
            }
            this.option.forEach(opt => {
                this.recursiveFn(opt, getCheckArr);
            });
            this.option.forEach(opt => {
                this.recursiveFn(opt, resetDistable);
            });
        },
        // disabled action
        // 根据选中的值进行设置是否可选
        disabeldAction(item) {
            const { thatPair, thisPair } = this.disabledPair;
            if (!thatPair || !thisPair) {
                return;
            }
            const pairs = [...thatPair, ...thisPair];
            const { value: itemVal } = item;
            const belongPair = pairs.includes(itemVal) || pairs.includes("all");
            let distableValues = [];
            let ableValues = [];
            if (!belongPair) return;
            if (thisPair.includes(item.value) || (thisPair.includes("all") && !thatPair.includes(item.value))) {
                this.setDisabled(thisPair, item, thatPair);
                return;
            }
            if (thatPair.includes(item.value) || (thatPair.includes("all") && !thisPair.includes(item.value))) {
                this.setDisabled(thatPair, item, thisPair);
            }
            this.$emit("handleSelect", this.option);
            this.disabeldAction(this.activeItem);
        },
        // 设置 disabled 值 values: 互斥的另一方数组， curItem 当前选中的值
        setDisabled(exceptValues, curItem, values) {
            const { checked: curChecked, childrenValues, value: curValue, siblingValues } = curItem;
            this.checkArr = [];
            if (values.includes("all")) {
                if (siblingValues) {
                    this.checkArr = new Array(siblingValues.length - exceptValues.length).fill(true);
                }
            } else {
                this.checkArr = new Array(values.length).fill(true);
            }
            const toDisabled = (item) => {
                const { value, checked } = item;
                if (values.includes(value) || (values.includes("all") && !exceptValues.includes(value))) {
                    if (siblingValues && siblingValues.includes(value)) {
                        this.checkArr.push(checked);
                        this.checkArr.shift();
                    }
                }
                const itemChild = item.children;
                if (itemChild && itemChild.length > 0) {
                    itemChild.forEach(child => {
                        toDisabled(child);
                    });
                }
            };
            this.option.forEach(child => {
                toDisabled(child);
            });
            this.option.forEach(child => {
                if (exceptValues.includes(child.value) || (exceptValues.includes("all") && !values.includes(child.value))) {
                    child.disabled = this.checkArr.some(val => val === true);
                }
            });
        },
        // disabled action
        // 根据选中的值进行设置是否可选
        disabeldAction(item) {
            const { thatPair, thisPair } = this.disabledPair;
            if (!thatPair || !thisPair) {
                return;
            }
            const pairs = [...thatPair, ...thisPair];
            if (pairs.includes(item.value) || pairs.includes("all")) {
                if (thisPair.includes(item.value) || (thisPair.includes("all") && !thatPair.includes(item.value))) {
                    this.setDisabled(thatPair, item, thisPair);
                    return;
                }
                if (thatPair.includes(item.value) || (thatPair.includes("all") && !thisPair.includes(item.value))) {
                    this.setDisabled(thisPair, item, thatPair);
                }
            }
        },
        showNextLevel(item) {
            if (item.disabled) return;
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
.multiCascader-multil-content {
    display: inline-block;
}
.multiCascader-menu-item {
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
    &:hover {
        background-color: rgba(125,139,169,.1);
    }
}
.item-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
}
</style>
