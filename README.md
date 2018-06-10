## multi-cascader

> 基于 element-ui 的多选层级菜单，类似于单选菜单， 但是支持多选。

## how to install

```
npm install multi-cascader --save
```

## how to use

```
import multiCascader from "multi-cascader";

Vue.use(multiCascader);
```

## Attributes

| 参数           | 说明                                       | 类型     | 可选值  | 默认值  |
| ------------ | ---------------------------------------- | ------ | ---- | ---- |
| `options`    | 可选项数据源， 每一项的配置如下：```{ value: "选项的 value", label: "选项的名字"， checked: 可选值： true / false, 表示当前选项是否被选中， children: 表示当前选项的下一级 }``` | array  | --   | []   |
| `width`      | 层级选择器弹窗的宽度                               | String | --   | ""   |
| `height`     | 层级选择器弹窗的高度                               | String | --   | ""   |
| `inputValue` | 显示在层级选择器组件中input 中的值                     | String | --   | ""   |

##  Events

| 事件名称                       | 说明                  | 回调参数          |
| -------------------------- | ------------------- | ------------- |
| `on-selected``on-selected` | 选择器中的某一项被选中的时候触发的事件 | 数组，数组内包含被选中的值 |

