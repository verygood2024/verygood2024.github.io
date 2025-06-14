---
title: 极值-最值
excerpt: 基础
author: 李岚霏
tags:
- 数学
description: 数学题
copyright_author: 李岚霏
top_img: /img/img/云雾.jpg
cover: /img/img/云雾.jpg
copyright_info: 转载请声明出处。
copyright_author_href: /categories/%E4%BD%9C%E8%80%85/%E6%9D%8E%E5%B2%9A%E9%9C%8F/
comment: gitalk
banner_img: /img/云雾.jpg
sticky: 26
math: true
mermaid: true
mathjax: true
katex: true
categories:
- - 技术
- - 作者
  - 李岚霏
abbrlink: c5eb7197
date: 2024-06-17 19:00:20
---
## 极值

$$
f(x)在U(x_0)有定义,\forall x\in\mathring{U}
$$
$$
若f(x)<f(x_0)\Rightarrow f(x_0)是极大值,x=x_0是极大点
$$

$$
若f(x)>f(x_0)\Rightarrow f(x_0)是极小值,x=x_0是极小点
$$

### 定理一

$$
f(x)在x_0处可导,若f(x)在x_0处取得极值\Rightarrow f'(x_0)=0
$$

{% note danger %}
$$
f'(x_0)=0\nRightarrow f(x)在x_0处取得极值
$$
{% endnote %}

{% note success %}
证明方法：费马引理，请读者自行验证
{% endnote %}

### 定理二

$$
设f(x)在x_0处连续，且\mathring{U}(x_0,\delta)可导
$$

$$
\left.
\begin{matrix}
x \in (x_0-\delta,x_0),f'(x)>0 \\
x \in (x_0,x_0+\delta),f'(x)<0 \\
\end{matrix}
\right\}\Rightarrow f(x)在x=x_0处取得极大值
$$

$$
\left.
\begin{matrix}
x \in (x_0-\delta,x_0),f'(x)<0 \\
x \in (x_0,x_0+\delta),f'(x)>0 \\
\end{matrix}
\right\}\Rightarrow f(x)在x=x_0处取得极小值
$$

$$
若左邻域,右邻域,一阶导数符号不变,f(x)在x=x_0处不取极值
$$

### 定理三

$$
设f(x)在x=x_0处f'(x)=0,f''(x_0)存在f''(x_0)\ne0
$$

$$
f''(x_0)<0\Leftrightarrow f(x)在x_0处取得极大值
$$

$$
f''(x_0)>0\Leftrightarrow f(x)在x_0处取得极小值
$$

## 最值

$$
f(x)在U上有定义,\exists x_0\in U,使得\forall x\in U都有：
$$

$$
f(x)\leq f(x_0)\Rightarrow f(x_0)为f(x)在U上的最大值
$$

$$
f(x)\geq f(x_0)\Rightarrow f(x_0)为f(x)在U上的最大值
$$

{% note info %}
最值不一定是极值，极值不一定是最值
{% endnote %}

## 不等式链

$$
\frac{2}{\frac{1}{x}+\frac{1}{y}}\leq\sqrt{xy}\leq\frac{x+y}{2}\leq\sqrt{\frac{x^2+y^2}{2}}
$$

### 例题

#### 例1

$$
m,n>0且m+n-2\sqrt{3}=0,则max(mn)为?
$$

$$
解法一:[基本不等式]
$$

$$
m+n=2\sqrt{3}
$$

$$
\begin{equation}
\begin{aligned}
\sqrt{mn}&\leq\frac{m+n}{2}\\
mn&\leq(\frac{m+n}{2})^2\\
mn&\leq(\frac{2\sqrt{3}}{2})^2\\
mn&\leq3\\
当且仅当m=n时取等\\
max(mn)=3
\end{aligned}
\end{equation}
$$

---

$$
解法二:[拉格朗日数乘]
$$

$$
使用前提:\\
函数最值存在，若函数本身不存在最值，则此法的解皆不是最值\\
约束条件没有边界\\
约束函数需具有一阶连续偏导数，且约束函数的梯度向量不为0
$$

$$
f=mn\\
\\
g=m+n-2\sqrt{3}=0\\
\\
h=f-\lambda g\\
\\
\frac{\partial h}{\partial m}=0\\
$$

$$
\frac{\partial h}{\partial n}=0\\
\\
\left\{
\begin{aligned}
g&=&0&  \\
\frac{\partial h}{\partial m}&=&0&  \\
\frac{\partial h}{\partial n}&=&0&  \\
\end{aligned}
\right.
\\
\left\{
\begin{aligned}
\lambda&=&\sqrt{3}&  \\
m&=&\sqrt{3}&  \\
n&=&\sqrt{3}&  \\
\end{aligned}
\right.
\\
代入f即可求出极值，后可求最值\\
$$
