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

## attributes

| 属性名 | 描述 | 类型 | 默认值 |
| - | - | - | - | - |
| width | 菜单选择面板的宽度 | String | 220px |
| height | 菜单选择面板的高度 | String | 240px |
| options | 选择器菜单配置项 | Array | [] |
| inputValue | 选择器输入框内显示的内容 | String | -- |
| outputType | 选中项输出的字段名 | String | value　|
| disabledPair | 互斥选项对儿 | Object | -- |

## events

| 事件名 | 描述 | 接受值 | 返回值 |
| - | - | - | - | - |
| on-selected | 菜单选项选中时事件触发 | 由选择项的某一个字段组成的数组 | -- |

## attributes details

### `options` 菜单配置

配置属性：

| 属性名 | 描述 | 类型
| - | - | - | - | - |
| value | 选项的值 | String or Number
| label | 选项的名称 | String 
| checked | 该选项是否被选中 | Boolean |
| children | 如果存在下一级菜单，是属于该选项的下一级选项值， 非必须 | Array |

示例：
```javascript
options: [{
    value: "1",
    label: "一级菜单",
    checked: false,
    children: [
        {
            value: 11,
            checked: false,
            label: "二级菜单",
            children: [
                {
                    value: "21",
                    checked: false,
                    label: "三级菜单1"
                },
                {
                    value: "22",
                    checked: false,
                    label: "三级菜单2"
                }
            ]
        },
        {
            value: "12",
            checked: false,
            label: "二级菜单"
        }
]
```

### `outputType`

`outputType` 用于输出选中选择项对象的某一字段， 默认值： `value`,
当传入 `outputType` 为`item`时， 输出选中这一项的对象(不包括 `children` 属性)；

### `disabledPair`
`disabledPair` 用于设置禁用对， 对象形式， 接收两个属性： `thisPair` `thatPair`:

```javascript
disabledPair: {
  thisPair: [],
  thatPair: []
}
```
`thisPair` 和 `thatPair` 这两个数组内的值是互斥的， 例如：

```
thisPair: [1],
thatPair: [2]
```
那么， 当值为 `1` 的选项被选中的时候， 值为 `2` 的选项将会被禁用掉， 反之亦然。但其他选项的值不会受到影响
除了传递单独的项之外， 还可以单独传入一个 `all`。

```
thisPair: [1],
thatPair: ["all"]
```
传入`all` 表明`thisPair` 中的选项 `1` 是和 选项值中除了 `1` 之外的所有选项都是互斥的。

## demos

* 基本的选项配置

![image](/uploads/5f7c395882e3e81fc8d35a17f7d4e697/image.png)

```vue
<multiCascader width="240px" height="220px" :options="configOptions" @on-selected="getSelected" :inputValue="configTips"></multiCascader>
```

```javascript
configOptions: [{
    value: "1",
    label: "一级菜单",
    checked: false,
    children: [
        {
            value: "11",
            checked: false,
            label: "二级菜单"
        },
        {
            value: "12",
            checked: false,
            label: "二级菜单"
        }
]}
...
getSelected(val) {
    this.selectGroups = val;
    this.configTips = `已选择${val.length}个分组`;
},
console.log(this.selectGroups); // ["11"]
```

* 设置规定输出值得类型

使用`outputType` 可以输出选中项对象除`children`之外的任何属性

```vue
<multiCascader width="240px" height="220px" :options="configOptions" @on-selected="getSelected" :inputValue="configTips" outputType="label"></multiCascader>
```

```javascript
...
console.log(this.selectGroups); // ["二级菜单"]
```
**特别， 当 `outputType` 属性设为 item 的时候， 可以输出当前选中项的对象**

```vue
<multiCascader width="240px" height="220px" :options="configOptions" @on-selected="getSelected" :inputValue="configTips" outputType="item"></multiCascader>
```

```javascript
...
console.log(this.selectGroups); // [{ label: "二级菜单"， value： "21", checked: false }]
```

* 设置禁用选项对  
![image](/uploads/19da4d0b2b2947b94d4d5c034773c728/image.png)

```vue
<multiCascader width="240px" height="220px" :options="configOptions" @on-selected="getSelected" :inputValue="configTips" ></multiCascader>
```

```javascript
disabledPair: {
    thisPair: ["1"],
    thatPair: ["2"]
},
configOptions: [{
    value: "1",
    label: "一级菜单",
    checked: false,
    children: [
        {
            value: "11",
            checked: false,
            label: "二级菜单"
        },
        {
            value: "12",
            checked: false,
            label: "二级菜单"
        }]
    },
    {
        value: "2",
        checked: false,
        label: "一级菜单（2）"
    },
    {
        value: "3",
        checked: false,
        label: "一级菜单（3）"
    }
]
```

* 设置某一选项和其他之外的所有选择均互斥的效果  
![image](/uploads/d5529bfaede88d65b0b1e66fdb78856f/image.png)

```javascript
disabledPair: {
    thisPair: ["1"],
    thatPair: ["all"]
}
```
