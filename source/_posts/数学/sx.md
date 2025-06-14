---
title: 向量-导数求解初中几何题
excerpt: 向量-导数
author: 李岚霏
tags:
- 数学
comment: gitalk
description: 数学题
copyright_author: 李岚霏
top_img: /img/img/云雾.jpg
cover: /img/img/云雾.jpg
copyright_info: 转载请声明出处。
copyright_author_href: /categories/%E4%BD%9C%E8%80%85/%E6%9D%8E%E5%B2%9A%E9%9C%8F/
sticky: 17
banner_img: /img/云雾.jpg
math: true
mermaid: true
mathjax: true
katex: true
categories:
- - 技术
- - 作者
  - 李岚霏
abbrlink: d4448753
date: 2024-05-27 18:40:00
---

**例一：**

![-](/jpg/sx1.jpg)

**解：**

$$
设:\\
||bc||=BC；||ad||=AD；||ae||=AE；||fc||=FC；||ba||=AB\\
bc = (x,0)；ad=(x,0)；ae=(0,x_2)；fc=(x_2,0)；ba=(0,x)\\
得:\\
ba+bc=bd=(x,x)\\
ea+ad=ed=(x,-x_2)\\
db+dc=dc=(0,-x)\\
dc+cf=df=(-x_2,-x)\\
||df||=\sqrt{[df,df]}；||ed||=\sqrt{[ed,ed]}\\
||ed||=||df||=ED=DF\\
cos\theta=\frac{[df,ed]}{||ed||||df||}\\
cos\theta=0=90^o\Leftrightarrow\angle EDF\\
显然:DG\perp EF
$$


---

**例二：**

![-](/jpg/sx2.jpg)

**解：**

$$
设:\\
||bf||=BF；||be||=BE；||eo||=EO；||cf||=CF；||ba||=BA；||ef||=EF\\
显然且设:\\
bf=(5,0)；be=(x,0)；cf=(x,0)；ba=(x,y)；ef=(5-x,0)\\
得:\\
ba+ed=ea=(0,y)\\
ea+ef=ed=(5-x,y)\\
eo=(\frac{5-x}{2},\frac{y}{2})\\
\left\{
\begin{aligned}
||ba||=3  \\
||eo||=2  \\
\end{aligned}
\right.
\\
解得
\left\{
\begin{aligned}
x&=1.8  \\
y&=2.4  \\
\end{aligned}
\right.
\\
显然:\\
y=AE=DE=2.4
$$


---

**例三：**

![-](/jpg/sx4.jpg)

**解：**
$$
设:\\
||ba||=BA；||bc||=BC；||bd||=BD\\
得:\\
AD//BC\Leftrightarrow\angle DAC=\angle ACB=45^o\Leftrightarrow BA=AC\\
ba=(\sqrt{2},y)；bc=(2\sqrt{2},0)\\
\begin{equation}
\begin{aligned}
\sqrt{[ba,ba]}&=2\\
y&=\sqrt{2}
\end{aligned}
\end{equation}\\
ba+bc=bd\\
||bd||=2\sqrt{5}
$$


---

**例四：**

![-](/jpg/sx3.jpg)

**解：**

$$
显然:\\
PC=\sqrt{(x-2)^2+(x\frac{3}{3})^2}\\
PB=\frac{\sqrt{x^2+(x\frac{\sqrt{3}}{3})^2}}{2}\\
f(x)=\sqrt{(x-2)^2+(x\frac{3}{3})^2}+\frac{\sqrt{x^2+(x\frac{\sqrt{3}}{3})^2}}{2}\\
\frac{df}{dx}=\dfrac{\left(2\,x-3\right)\,\sqrt{4\,{x}^{2}-12\,x+12}\,\left|x\right|+2\,{x}^{3}-6\,{x}^{2}+6\,x}{\left(2\,\sqrt{3}\,{x}^{2}-2\cdot 3\,\sqrt{3}\,x+2\cdot 3\,\sqrt{3}\right)\,\left|x\right|}\\
令:\\
\frac{df}{dx}=0\\
解得:x=0\\
得:\\
f(0)=2\\
故:\\
min(PC+\frac{PB}{2})=2
$$
{% note primary %}
虽然，例四其实连算的不用算……
{% endnote %}
