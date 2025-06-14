---
title: 机器学习-线性回归基础
tags:
- 技术
excerpt: 备忘录
author: 李岚霏
description: 线性回归
copyright_author: 李岚霏
copyright_author_href: /categories/作者/李岚霏/
comment: gitalk
sticky: 77
math: true
mermaid: true
top_img: /img/img/云雾.jpg
mathjax: true
katex: true
categories:
- - 技术
- - 作者
  - 李岚霏
abbrlink: 4e406d39
date: 2024-07-18 18:00:20
---

## 基本符号

输入变量（特征或输入特征） = x

输出变量（目标变量） = y

训练示例 = (x,y)

训练示例总数 = m

单个训练示例 = (x<sup>(i)</sup>,y<sup>(i)</sup>)或(x<sub>i</sub>,y<sub>i</sub>)

## 监督学习

$$
x -> f（模型） -> ŷ（y的估计值）
$$

### 线性回归模型

$$
f_{w,b}(x)=wx+b你可以认为它等同于f(x)=kx+b\\
w、b=模型参数（系数、权重）
$$

#### 平方误差代价函数

在这之前这是篇很好的文章[极值-最值 - yesandnoandperhaps](https://yesandnoandperhaps.github.io/2024/06/17/sx3/)
$$
ŷ^{(i)}= f_{w,b}(x^{(i)})\\

f_{w,b}(x^{(i)}) = wx^{(i)} + b
$$

$$
j(w,b)=\frac{\sum_{i=1}^m(\hat{y}^{(i)}- y^{(i)})^2}{2m}\\
J(w,b)=\frac{\sum_{i=1}^m(f_{w,b}(x^{(i)}) - y^{(i)})^2}{2m}\\
min(j(w,b))
$$

##### b=0时

$$
f_w(x)=wx\\
J(w)=\frac{\sum_{i=1}^m(f_{w}(x^{(i)}) - y^{(i)})^2}{2m}\\
目标：求min(j(w))
$$

##### 成本函数可视化

$$
很显然：J(w,b)在三维空间中\\
若将它省略J可得到一个二维平面图，显然b是y轴，w是x轴
$$

#### 梯度下降

$$
将w,b的基础值设为0\\
\alpha = 学习率\\
$$

$$
梯度下降算法
\begin{cases}
w = w-\alpha\frac{\partial J(w,b)}{\partial w}\\
b = b-\alpha\frac{\partial J(w,b)}{\partial b}
\end{cases}\\
$$

$$
实时更新的梯度下降算法
\begin{cases}
tmp_w = w-\alpha\frac{\partial J(w,b)}{\partial w}\\
w = tmp_w\\
tmp_b = b-\alpha\frac{\partial J(w,b)}{\partial b}\\
b = tmp_b
\end{cases}\\
$$

##### 将以上合并

**第一步**

$$
求出\frac{\partial J(w,b)}{\partial w},\frac{\partial J(w,b)}{\partial b}\\
$$

$$
得：\frac{\sum_{i=1}^m(f_{w,b}(x^{(i)}) - y^{(i)})x^{(i)}}{m},\frac{\sum_{i=1}^m(f_{w,b}(x^{(i)})-y^{(i)})}{m}
$$

**第二步**
$$
w = w-\frac{\alpha\sum_{i=1}^m(f_{w,b}(x^{(i)}) - y^{(i)})x^{(i)}}{m}\\
$$

$$
b = b-\frac{\alpha\sum_{i=1}^m(f_{w,b}(x^{(i)})-y^{(i)})}{m}
$$
<b>总结步骤：</b>梯度下降->平方误差代价函数->线性回归

#### 一些符号

$$
x_j = j^{th}feature（特征）\\
n = number\ of\ feature（特征总数）\\
\vec{x}^{(i)}= features\ of\ i^{th}\ training\ example （训练集）\\
x^{(i)}_j= value\ of\ feature\ j\ in\ i^{ih}\ training\ example（训练集的第几个值）
$$

#### 多元线性回归

$$
如果有n个特征，即可以得到如下：\\
f_{w,b}(x)=w_{1}x_{1}+w_{2}x_{2}+…+w_nx_n+b\\
进一步即可得到：f_{\textbf{w},b}(\textbf{x})=\textbf{w}^T\textbf{x}+b\\
或表示为：f_{\vec{w},b}(\vec{x}) = \vec{w}·\vec{x}+b\\
\ \ \ \\
Without \ vectorization （未向量化）：f_{\vec{w},b}(\vec{x})=\sum_{j=1}^nw_jx_j+b\\
vectorization（向量化）：f_{\vec{w},b}(\vec{x}) = \vec{w}·\vec{x}+b\\
$$

**Without  vectorization代码示例**

```python
f = 0
for j in range(0,n):
    f = f+w[j]*x[j]
f=f+b
```

**vectorization 代码示例**

```python
f = np.dot(w,x)+b
```

##### 多元线性回归-成本函数

$$
J(\vec{w},b)
$$

##### 多元线性回归-梯度下降

$$
\begin{cases}
w_j = w_j-\alpha\frac{\partial J(\vec{w},b)}{\partial w_j}\\
b = b-\alpha\frac{\partial J(\vec{w},b)}{\partial b}
\end{cases}\\
$$

$$
\begin{cases}
j = n\\
w_n = w_n-\frac{\alpha\sum_{i=1}^m(f_{\vec{w},b}(\vec{x}^{(i)}) - y^{(i)})x^{(i)}_1}{m}\\
b = b-\frac{\alpha\sum_{i=1}^m(f_{w,b}(x^{(i)})-y^{(i)})}{m}\\
simultaneously\ update（同时更新）\\
w_j(for\ j=1,…,n)and\ b
\end{cases}\\
$$

#### 其它方法

##### Normal equation正规方程

它只适用与线性回归中

#### 特征缩放

$$
y\leq x_1\leq z\\
\mu = 训练集x_1的平均值\\
\sigma = 标准差\\
(1):使用最大值进行：\\
x_{1,scaled} = \frac{x_1}{z}\\
\frac{y}{z}\leq x_{1,scaled}\leq 1\\
(2):使用mean\ normalization（归一化）进行：\\
x_1 = \frac{x_1-\mu_1}{z-y}\\
\frac{y-\mu_1}{z-y}\leq x_1 \leq \frac{z-\mu_1}{z-y}\\
(3):使用Z-score\ normalization（标准化）进行：\\
x_1=\frac{x_1-\mu_1}{\sigma_1}\\
\frac{y-\mu_1}{\sigma}\leq x_1 \leq \frac{z-\mu_1}{\sigma}\\
$$

#### 检测梯度下降是否收敛

$$
设置一个\epsilon等于一个较小的值，例如0.001，当\epsilon\leq J(\vec{w},b)时通常认为它经收敛了
$$



#### 学习率的选择

$$
\alpha = 学习率\\
你可以从较大的值开始，逐步调试，必须要说明的是：\\
设置过大，会导致易损失值爆炸、易振荡\\
设置过小，会导致易过拟合、收敛速度很慢\\
通常建议在0.01\sim0.001逐步测试
$$

更好的办法，请参看[Leslie N. Smith在2015年发表的论文[Cyclical Learning Rates for Training Neural Networks]](https://arxiv.org/abs/1506.01186)

#### 特征工程

它可以让模型更加准确

例:
$$
预测一个长方体的的价格\\
假设它的价格与长x_1,宽x_2,高x_3有关\\
显然可以得到：\\
f_{\vec{w},b}(\vec{x}) = w_1x_1+w_2x_2+w_3x_3+b\\
观察到它们的关系得到：\\
长方体体积x_4=x_1x_2x_3\\长方体底面积x_5=x_1x_2\\
故得到：f_{\vec{w},b}(\vec{x}) = w_1x_1+w_2x_2+w_3x_3+w_4x_4+w_5x_5+b\\
$$

### 多项式回归

拟合非线性函数

例：

若数据近似二次函数，即得此模型：
$$
f_{\vec{w},b}(x) = w_1x+w_2x^2+b
$$

### Motivations

这是一种分类方法

线性回归 -> 定义分类位置 -> 完成

**缺陷：**数据复杂时，分类位置定义不完善时，会导致例如将好的数据分类至坏的



### 逻辑回归

它将输出0到1之间的数
$$
g(z)= \frac{1}{1+e^{-z}}\\
0<g(z)<1\\
线性回归: z =\vec{w}\cdot \vec{x}+b\\
将它们合并:\\f_{\vec{w},b}(\vec{x})=g(\vec{w}\cdot \vec{x}+b)=\frac{1}{1+e^{-(\vec{w}\cdot \vec{x}+b)}}
$$

#### 决策边界

它可以用于预测逻辑回归
$$
z =\vec{w}\cdot \vec{x}+b = 0
$$
