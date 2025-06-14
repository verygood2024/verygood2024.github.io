---
title: Python Tkinter汇总介绍
tags:
- 技术
excerpt: 备忘录
author: 李岚霏
comment: gitalk
sticky: 23
description: Tkinter汇总介绍
copyright_author: 李岚霏
copyright_author_href: /categories/作者/李岚霏/
banner_img: /img/py.jpg
top_img: /img/img/py.jpg
categories:
- - 技术
- - 作者
  - 李岚霏
abbrlink: f3166f99
date: 2024-06-09 16:00:00
---

## Python ([Tkinter](https://docs.python.org/zh-cn/3/library/tk.html))

### 下载

```text
pip install tk
```

**由于Tkinter的GUI界面十分的不美观，建议下载[ttkbootstrap](https://ttkbootstrap.readthedocs.io/en/latest/zh/)**

```text
python -m pip install ttkbootstrap
```

### Python Tkinter 项目例子

[Lightweight_notepad](https://github.com/yesandnoandperhaps/Lightweight_notepad)

---

### 窗口

<b>Tk()</b>类——主窗口
<b>Toplevel()</b>类——子窗口

**例如：**

```python
from tkinter import *

root = Tk()
root.mainloop()#创建主循环

window = tk.Toplevel()
window.mainloop()#创建主循环

```

---

#### 窗口属性

属性名|介绍||属性名|介绍
:--:|:--:|:--:|:--:|:--:
bg|窗口的背景颜色||bd|窗口的边框宽度(默认为2像素)
cursor|鼠标指针在窗口上时的样式||height|窗口的高度
width|窗口的宽度||relief|窗口的边框样式
title|窗口的标题||resizable|窗口是否可以调整大小(默认为 True)
iconbitmap|窗口的图标||iconify|将窗口最小化
deiconify|将窗口从最小化恢复||state|窗口的状态(normal、iconic、withdrawn、oricon)
overrideredirect|是否隐藏窗口的标题栏和边框||configure()|configure(bg="",bd="")
geometry()|geometry("widthxheight")||--|--

<b>使用窗口属性</b>

对象名.属性名 = 属性值

**例如：**

```python
from tkinter import *

root = Tk()
root.configure(bg="purple",bd="2")

root.mainloop()
```

---

#### tkinter wm_attributes

- `-alpha`：设置窗口透明度，取值为0.0（完全透明）到1.0（完全不透明）之间的浮点数。
- `-topmost`：设置窗口是否置顶，取值为0或1。
- `-disabled`：设置窗口是否被禁用，取值为0或1。
- `-fullscreen`：设置窗口是否全屏显示，取值为0或1。
- `-toolwindow`：设置窗口是否为工具窗口，取值为0或1。
- `-transparentcolor`：设置窗口的透明颜色，取值为颜色名称或#RRGGBB格式的十六进制值。
- `-modified`：设置窗口是否被修改，取值为0或1。
- **只有-alpha和-topmost参数是在所有平台上都可用的，其他参数的可用性可能因平台而异。**

<b>使用tkinter wm_attributes</b>

对象名.wm_attributes(对应变量名,变量值)

**例如：**

```python
from tkinter import *

root = Tk()
root.configure(bg="purple",bd="2")

root.wm_attributes('-topmost', 0)

root.mainloop()
```

---

#### tkinter protocol

- `WM_DELETE_WINDOW`：窗口关闭事件，对应于用户点击窗口关闭按钮或调用`destroy`方法时触发。

- `WM_TAKE_FOCUS`：当窗口或其子控件尝试获取输入焦点时触发。

- `WM_SAVE_YOURSELF`：当窗口管理器要求应用程序保存其状态时触发。

- `WM_LOSE_FOCUS`：当窗口或其子控件失去输入焦点时触发。

<b>使用tkinter protocol</b>

对象名.protoco（”事件名“,调用函数）

**例如：**

```python
from tkinter import *

def on():
    print("2")

root = Tk()
root.configure(bg="purple",bd="2")

root.wm_attributes('-topmost', 0)

root.protocol("WM_DELETE_WINDOW", on)

root.mainloop()

```

---

### 页面布局

#### 页面布局-简介

- `pack`：包装
- `grid`：网格
- `place`：位置

---

#### pack页面布局

- `-anchor`：容器的对齐方式【北**N**、南**S**、西**W**、东**E**、东南**SE**、西南**SW**、东北**NE**、西北**NW**】
- `-after`：将容器置于其他组件之后
- `-before`：将容器置于其他组件之前
- `-expand`：容器在整个窗口上，将容器放置在剩余空闲位置上的中央【包括水平和垂直方向】
- `-fill`：决定容器是否填充，以及填充的方向【X轴**x**、Y轴**y**、全部填充**both**】
- `-ipadx`：容器在X轴上的显示大小
- `-ipady`：容器在Y轴上的显示大小
- `-padx`：容器之间在X轴上的外边距
- `-pady`：容器之间在Y轴上的外边距
- `-side`：决定容器停靠的方向【上**top**、下**bottom**、左**left**、右**right**】
- **side="left"或side="right"时，fill="x"不起作用，只能填充y**
- **side=“top”,side="bottom"时，fill="y"不起作用，只能填充x**

---

#### grid页面布局

- `row`：容器所在行

- `column`：容器所在列

- `-ipadx`：容器在X轴上的显示大小

- `-ipady`：容器在Y轴上的显示大小

- `-padx`：容器之间在X轴上的外边距

- `-pady`：容器之间在Y轴上的外边距

- `rowspan`：容器跨几行

- `columnspan`：容器跨几列

- `sticky`：容器的对齐停靠方向【北**N**、南**S**、西**W**、东**E**、东南**SE**、西南**SW**、东北**NE**、西北**NW**】

- `grid_bbox(column=None, row=None, col2=None, row2=None)`：返回一个有四个元素的元组，用来描述容器内一些或者全部单元的边界。【返回顺序：左上方区域的x坐标，左上方区域的y坐标，宽度，高度】【若只传递了 `column` 和 `row` 参数，返回参数描述的是该行列的单元大小】【若传递了 `col2` 和 `row2` 参数，返回参数描述的是从 `column` 列到 `col2` 列，以及从 `row` 行到 `row2` 行总体区域的大小】

- `grid_forget()`：取消容器显示，容器仍在内存中，再次调用`grid()`以显示【需重新设置`grid(option)`选项】

- `grid_info()`：返回容器各个`option`组成的`dict`

- `grid_location(x, y)`：设定容器在屏幕中相对于容纳单元的（x，y）坐标，并返回`grid`系统中的哪个单元包含了该坐标（column，row）

- `grid_propagate()`：正常情况下，所有容器都会根据内容自动调整大小【固定容器大小： `w.grid_propagate(0)`】

- `grid_remove()`：取消容器显示，容器仍在内存中，会存储`grid(option)`，再次调用`grid()`以显示

- `grid_size()`：返回有两个元素的元组，分别表示容器所在的列数和行数。

- `w.grid_slaves(row=None, column=None)`：返回一组由容器管理容器的`list`。若未提供任何参数，返回包含所有容器的`list`【提供 `row` 参数，返回该行所有容器，提供 `column` 参数，则返回该列所有容器】

---

#### place

- `anchor`：控制容器在place分配的空间中的位置【北**N**、南**S**、西**W**、东**E**、东南**SE**、西南**SW**、东北**NE**、西北**NW**、中央**CENTER**】【默认**NW**】

- `bordermode`：指定边框模式【内部**INSIDE**、外部**OUTSIDE**】【默认**INSIDE**】

- `height`：指定该容器的高度【像素】

- `in_`：将该容器放到该选项指定的容器中【指定的容器必须是该容器的父容器】

- `relheight`：指定该容器相对于父容器的高度【取值范围是0.0~1.0】

- `relwidth`：指定该容器相对于父容器的宽度【取值范围是0.0~1.0】

- `relx`：指定该容器相对于父容器的水平位置【取值范围是0.0~1.0】

- `rely`：指定该容器相对于父容器的垂直位置【取值范围是0.0~1.0】

- `width`：指定该容器的宽度【像素】

- `x`：指定该容器的水平偏移位置【像素】【若同时指定了relx选项，优先实现relx选项】

- `y`：指定该组件的垂直偏移位置【像素】【若同时指定了rely选项，优先实现rely选项】

### 按钮

使用<b>Button()</b>类

**例如：**

```python
from tkinter import *

root = Tk()

b = Button(root, text='')
b.pack()

root.mainloop()
```

---

#### 按钮属性

- `text`：按钮上显示的文本。
- `width`：按钮的宽度。
- `height`：按钮的高度。
- `bg`：按钮的背景颜色。
- `fg`：按钮上文本的颜色（前景颜色）。
- `font`：按钮上文本的字体。
- `command`：按钮被点击时触发的函数。

**例如：**

```python
from tkinter import *

root = Tk()

b = Button(root, text='yes', bg='red', fg='white', font=('宋体', 16), command=())
b.pack()

root.mainloop()
```

### 标签

使用<b>Label()</b>类

**例如：**

```python
from tkinter import *

root = Tk()

label = Label(root, text="Hello World!")
label.pack()

b = Button(root, text='yes', bg='red', fg='white', font=('宋体', 16), command=())
b.pack()

root.mainloop()
```

---

#### 标签属性

- `text`：标签文字
- `relief`：标签样式，设置控件3D效果【平面**FLAT**、凹陷**SUNKEN**、凸起**RAISED**、凹槽**GROOVE**、盆地**RIDGE**】
- `bg`：标签背景色
- `fg`：标签前景色
- `bd`：标签文字边框宽度【需要relief结合使用才会凸显效果】
- `font`：标签文字字体设置【`font=("字体", "字号", "样式", "样式"......)`】【样式：粗体**bold**、斜体**italic**、下划线**underline=1**、删除线**overstrike=1**】【**下划线和删除线需要重新设置字体**】
- `justify`：标签文字对齐方式【左**LEFT**、右**RIGHT**、中央**CENTER**】
- `underline`：下划线【取值即是带下划线的字符串索引，为 0 时，第一个字符带下划线，为 1 时，第两个字符带下划线，以此类推】
- `wraplength`：按钮达到限制的屏幕单元后换行显示
- `height`：字体高度【需要relief结合使用才会凸显效果】
- `wideth`：字体宽度【需要relief结合使用才会凸显效果】
- `image`：标签插入图片【插入的图片必须有PhotImage转换格式后才能插入，并且转换的图片格式必须是.gif格式】

---

### 框架

使用<b>Frame()</b>类

**例如：**

```python
from tkinter import *

root = Tk()

f = Frame(root)
f.pack()

label = Label(f, text="Hello World!")
label.pack()

root.mainloop()
```

#### 框架属性

- `bg`：框架背景颜色
- `bd`：框架的大小，默认为 2 个像素
- `cursor`：鼠标指针在窗口上时的样式
- `height`：框架的高度，默认值0
- `highlightbackground`：框架没有获得焦点时，高亮边框的颜色，默认由系统指定。
- `highlightcolor`：框架获得焦点时，高亮边框的颜色
- `highlightthickness`：指定高亮边框的宽度，默认值为0-不带高亮边框
- `relief`：边框样式【平面**FLAT**、凹陷**SUNKEN**、凸起**RAISED**、凹槽**GROOVE**、盆地**RIDGE**】
- `width`：设置框架宽度，默认值为0
- `takefocus`：指定该组件是否接受输入焦点（用户可以通过 tab 键将焦点转移上来），默认为 false

### 画布

使用<b>Canvas()</b>类

**例如：**

```python
from tkinter import *

root = Tk()

c = Canvas(root)
c.pack()

label = Label(root, text="Hello World!")
label.pack()

root.mainloop()
```

#### 画布属性

- `bg`：画布背景颜色
- `bd`：画布的大小，默认为 2 个像素
- `cursor`：鼠标指针在窗口上时的样式
- `confine`：若为 true (默认), 画布不能滚动到可滑动的区域外。
- `height`：画布的高度，默认值0
- `highlightbackground`：画布没有获得焦点时，高亮边框的颜色，默认由系统指定。
- `highlightcolor`：画布获得焦点时，高亮边框的颜色
- `highlightthickness`：指定高亮边框的宽度，默认值为0-不带高亮边框
- `relief`：边框样式【平面**FLAT**、凹陷**SUNKEN**、凸起**RAISED**、凹槽**GROOVE**、盆地**RIDGE**】
- `width`：设置画布宽度，默认值为0
- `takefocus`：指定该组件是否接受输入焦点（用户可以通过 tab 键将焦点转移上来），默认为 false
- `scrollregion`：一个元组 tuple (w, n, e, s)，定义了画布可滚动的最大区域，w 为左边，n 为头部，e 为右边，s 为底部
- `xscrollincrement`：用于滚动请求水平滚动的数量值
- `xscrollcommand`：水平滚动条，如果画布是可滚动的，则该属性是水平滚动条的 .set（）方法
- `yscrollincrement`：类似 xscrollincrement, 但是垂直方向
- `yscrollcommand`：垂直滚动条，如果画布是可滚动的，则该属性是垂直滚动条的 .set（）方法

#### 画布方法

arc − 创建一个扇形

```python
coord = 10, 50, 240, 210
arc = canvas.create_arc(coord, start=0, extent=150, fill="blue")
```

image − 创建图像

```python
filename = PhotoImage(file = "sunshine.gif")
image = canvas.create_image(50, 50, anchor=NE, image=filename)
```

line − 创建线条

```python
line = canvas.create_line(x0, y0, x1, y1, ..., xn, yn, options)
```

oval − 创建一个圆

```python
oval = canvas.create_oval(x0, y0, x1, y1, options)
```

polygon − 创建一个至少有三个顶点的多边形

```python
oval = canvas.create_polygon(x0, y0, x1, y1,....xn, yn, options)
```

### 单行文本框

使用<b>Entry()</b>类

**例如：**

```python
from tkinter import *

root = Tk()

e = Entry(root)
e.pack()

label = Label(root, text="Hello World!")
label.pack()

root.mainloop()
```

#### 单行文本框属性

- `bg`：输入框背景颜色
- `bd`：边框的大小，默认为 2 个像素
- `cursor`：鼠标指针在窗口上时的样式
- `font`：文本字体
- `exportselection`：默认情况下，你如果在输入框中选中文本，默认会复制到粘贴板，如果要忽略这个功能刻工艺设置 exportselection=0
- `fg`：文字颜色。值为颜色或为颜色代码，如：'red','#ff0000'
- `highlightcolor`：文本框高亮边框颜色，当文本框获取焦点时显示
- `justify`：显示多行文本的时候,设置不同行之间的对齐方式，可选项包括LEFT, RIGHT, CENTER
- `relief`：边框样式【平面**FLAT**、凹陷**SUNKEN**、凸起**RAISED**、凹槽**GROOVE**、盆地**RIDGE**】
- `selectbackground`：选中文字的背景颜色
- `selectborderwidth`：选中文字的背景边框宽度
- `selectforeground`：选中文字的颜色
- `show`：指定文本框内容显示为字符，值随意，满足字符即可。如密码可以将值设为 show="*"
- `state`：默认为 state=NORMAL, 文框状态，分为只读和可写，值为：normal/disabled
- `textvariable`：文本框的值，是一个StringVar()对象
- `width`：文本框宽度
- `xscrollcommand`：设置水平方向滚动条，一般在用户输入的文本框内容宽度大于文本框显示的宽度时使用。

#### 单行文本框方法

- delete ( first, last=None )删除文本框里直接位置值

>text.delete(10)      # 删除索引值为10的值
>text.delete(10, 20)  # 删除索引值从10到20之前的值
>text.delete(0, END)  # 删除所有值

- `get()`：获取文件框的值

- `icursor ( index )`：将光标移动到指定索引位置，只有当文框获取焦点后成立

- `index ( index )`：返回指定的索引值

- `insert ( index, s )`：向文本框中插入值，index：插入位置，s：插入值

- `select_adjust ( index )`：选中指定索引和光标所在位置之前的值

- `select_clear()`：清空文本框

- `select_from ( index )`：设置光标的位置，通过索引值 index 来设置

- `select_present()`：如果有选中，返回 true，否则返回 false。

- `select_range ( start, end )`：选中指定索引位置的值，start(包含) 为开始位置，end(不包含) 为结束位置start必须比end小

- `select_to ( index )`：选中指定索引与光标之间的值

- `xview ( index )`：该方法在文本框链接到水平滚动条上很有用。

- `xview_scroll ( number, what )`：用于水平滚动文本框。 what 参数可以是 UNITS, 按字符宽度滚动，或者可以是 PAGES, 按文本框组件块滚动。 number 参数，正数为由左到右滚动，负数为由右到左滚动。

### 列表框

使用<b>Listbox()</b>类

**例如：**

```python
from tkinter import *

root = Tk()

l = Listbox(root)
l.pack()

label = Label(root, text="Hello World!")
label.pack()

root.mainloop()
```

#### 列表框属性

- `bg`小部件的背景颜色
- `bd`它表示边框的大小。默认值是2像素
- `cursor`鼠标指针将看起来像光标类型，如点，箭头等
- `font`列表框项目的字体类型
- `fg`文字的颜色
- `height`它代表列表框中显示的行数。默认值是10
- `highlightcolor`当小组件处于焦点状态时，列表框项目的颜色
- `highlightthickness`高光的厚度
- `relief`边框样式【平面**FLAT**、凹陷**SUNKEN**、凸起**RAISED**、凹槽**GROOVE**、盆地**RIDGE**】
- `selectbackground`用于显示所选文本的背景颜色
- `selectmode`：用于确定可以从列表中选择的项目的数量【设置：**BROWSE**、**SINGLE**、**MULTIPLE**、**EXTENDED**】
- `width`：部件的宽度，单位是字符
- `xscrollcommand`：用来让用户水平滚动列表框
- `yscrollcommand`：用来让用户垂直滚动列表框

#### 列表框方法

- `activate(index)`：它用于选择指定索引处的行
- `curselection()`：它返回一个包含所选元素的行号的元组，从0开始计算。如果没有选择，则返回一个空元组
- `delete(first, last = None)`：它用于删除存在于给定范围内的行
- `get(first, last = None)`：它用于获取存在于给定范围内的列表项
- `index(i)`：它用于将具有指定索引的行放置在小组件的顶部
- `insert(index, *elements)`：它用于在指定的索引前插入具有指定数量元素的新行
- `nearest(y)`：它返回离列表框部件的y坐标最近的线的索引
- `see(index)`：它用于调整列表框的位置，使索引所指定的行可见
- `size()`：它返回存在于列表框部件中的行数
- `xview()`：这是用来使小部件可以水平滚动的
- `xview_moveto(fraction)`：它用于使列表框在水平方向上可滚动，其宽度为列表框中最长的一行的几分之一
- `xview_scroll(number, what)`：它用于使列表框可按指定的字符数水平滚动
- `yview()`：它使列表框可以垂直滚动
- `yview_moveto(fraction)`：它用于使列表框可垂直滚动，其宽度为列表框中最长的一行的几分之一
- `yview_scroll (number, what)`：它用于使列表框可按指定的字符数垂直滚动

### 菜单

使用<b>Menu()</b>类

**例如：**

```python
from tkinter import *

root = Tk()

m = Menu(root)

label = Label(root, text="Hello World!")
label.pack()

root.mainloop()
```

#### 菜单属性

| 名称                        | 说明                                                         |
| --------------------------- | ------------------------------------------------------------ |
| add_cascade(**options)      | 添加一个父菜单，将一个指定的子菜单，通过 menu 参数与父菜单连接，从而创建一个下拉菜单。 |
| add_checkbutton(**options)  | 添加一个多选按钮的菜单项                                     |
| add_command(**options)      | 添加一个普通的命令菜单项                                     |
| add_radiobutton(**options)  | 添加一个单选按钮的菜单项                                     |
| add_separator(**options)    | 添加一条分割线                                               |
| add(add(itemType, options)) | 添加菜单项，此处 itemType 参数可以是以下几种：“command”、“cascade”， “checkbutton”、“radiobutton”、“separator” 五种，并使用 options 选项来设置 菜单其他属性。 |
| delete(index1, index2=None)        | 1. 删除 index1 ~ index2（包含）的所有菜单项 2. 如果忽略 index2 参数，则删除 index1 指向的菜单项 |
| entrycget(index, option)           | 获得指定菜单项的某选项的值                                   |
| entryconfig(index, **options)      | 设置指定菜单项的选项                                         |
| index(index)                       | 返回与 index 参数相应的选项的序号                            |
| insert(index, itemType, **options) | 插入指定类型的菜单项到 index 参数指定的位置，类型可以是 是：“command”，“cascade”，“checkbutton”，“radiobutton” 或 “separator” 中的一个，或者也可以使用 insert_类型() 形式来， 比如 insert_cascade(index, **options)…等 |
| invoke(index)                      | 调用 index 指定的菜单项相关联的方法                          |
| post(x, y)                         | 在指定的位置显示弹出菜单                                     |
| type(index)                        | 获得 index 参数指定菜单项的类型                              |

#### 菜单方法

| 名称             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| accelerator      | 1. 设置菜单项的快捷键，快捷键会显示在菜单项目的右边，比如 accelerator = “Ctrl+O” 表示打开； 2. 注意，此选项并不会自动将快捷键与菜单项连接在一起，必须通过按键绑定来实现 |
| command          | 选择菜单项时执行的 callback 函数                             |
| label            | 定义菜单项内的文字                                           |
| menu             | 此属性与 add_cascade() 方法一起使用，用来新增菜单项的子菜单项 |
| selectcolor      | 指定当菜单项显示为单选按钮或多选按钮时选择中标志的颜色       |
| state            | 定义菜单项的状态，可以是 normal、active 或 disabled          |
| onvalue/offvalue | 1. 默认情况下，variable 选项设置为 1 表示选中状态，反之设置为 0，设置 offvalue/onvalue 的值可以自定义未选中状态的值|
| tearoff          | 1. 如果此选项为 True，在菜单项的上面就会显示一个可选择的分隔线； 2. 注意：分隔线会将此菜单项分离出来成为一个新的窗口 |
| underline        | 设置菜单项中哪一个字符要有下画线                             |
| value            | 1. 设置按钮菜单项的值 2. 在同一组中的所有按钮应该拥有各不相同的值 3. 通过将该值与 variable 选项的值对比，即可判断用户选中了哪个按钮 |
| variable         | 当菜单项是单选按钮或多选按钮时，与之关联的变量               |

{% note danger %}
暂收
{% endnote %}
