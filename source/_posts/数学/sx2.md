---
title: 空间中三角形四心
excerpt: 暴力
author: 李岚霏
tags:
- 数学
comment: gitalk
description: 数学题
copyright_author: 李岚霏
top_img: /img/img/云雾.jpg
copyright_info: 转载请声明出处。
copyright_author_href: /categories/%E4%BD%9C%E8%80%85/%E6%9D%8E%E5%B2%9A%E9%9C%8F/
sticky: 21
banner_img: /img/云雾.jpg
cover: /img/img/云雾.jpg
math: true
mermaid: true
mathjax: true
katex: true
categories:
- - 技术
- - 作者
  - 李岚霏
abbrlink: f82dc09c
date: 2024-05-30 16:00:00
---

## 重心

$$
已知三角形三顶点ABC在空间中的坐标为
$$
$$
A=(x_{1},y_{1},z_{1});
B=(x_{2},y_{2},z_{2});
C=(x_{3},y_{3},z_{3})
$$
$$
重心坐标=(\frac{x_{1}+x_{2}+x_{3}}{3},\frac{y_{1}+y_{2}+y_{3}}{3},\frac{z_{1}+z_{2}+z_{3}}{3})
$$

## 内心

$$
已知三角形三顶点ABC在空间中的坐标为
$$

$$
A=(x_{1},y_{1},z_{1});
B=(x_{2},y_{2},z_{2});
C=(x_{3},y_{3},z_{3})
$$

$$
a=\sqrt{(x_2-x_3)^2+(y_2-y_3)^2+(z_2-z_3)^2}
$$

$$
b=\sqrt{(x_3-x_1)^2+(y_3-y_1)^2+(z_3-z_1)^2}
$$

$$
c=\sqrt{(x_1-x_2)^2+(y_1-y_2)^2+(z_1-z_2)^2}
$$

$$
内心坐标=(\frac{ax_1+bx_2+cx_3}{a+b+c},\frac{ay_1+by_2+cy_3}{a+b+c},\frac{az_1+bz_2+cz_3}{a+b+c})
$$



## 垂心

$$
已知三角形三顶点ABC在空间中的坐标为
$$

$$
A=(x_{1},y_{1},z_{1});
B=(x_{2},y_{2},z_{2});
C=(x_{3},y_{3},z_{3})
$$

$$
a=(x_2-x_1)(x_3-x_1)+(y_2-y_1)(y_3-y_1)+(z_2-z_1)(z_3-z_1)
$$

$$
b=(x_1-x_2)(x_3-x_2)+(y_1-y_2)(y_3-y_2)+(z_1-z_2)(z_3-z_2)
$$

$$
c=(x_1-x_3)(x_2-x_3)+(y_1-y_3)(y_2-y_3)+(z_1-z_3)(z_2-z_3)
$$

$$
垂心坐标=(\frac{bcx_1+acx_2+abx_3}{bc+ac+ab},\frac{bcy_1+acy_2+aby_3}{bc+ac+ab},\frac{bcz_1+acz_2+abz_3}{bc+ac+ab})
$$

## python

使用[Triangle-calculations-yes](https://yesandnoandperhaps.github.io/2024/08/01/about/Triangle/)库是一个很好的办法

或复制粘贴以下代码【没有外心】

```python
import math

    class TriangleCentres(object):
        def __init__(self,pax=0, pbx=0, pcx=0, pay=0, pby=0, pcy=0, paz=0, pbz=0, pcz=0):
            self.CoordinatePointAX = pax
            self.CoordinatePointBX = pbx
            self.CoordinatePointCX = pcx
            self.CoordinatePointAY = pay
            self.CoordinatePointBY = pby
            self.CoordinatePointCY = pcy
            self.CoordinatePointAZ = paz
            self.CoordinatePointBZ = pbz
            self.CoordinatePointCZ = pcz

        def centroid(self):
            planar_centroid_x = (self.CoordinatePointAX + self.CoordinatePointBX + self.CoordinatePointCX) / 3
            planar_centroid_y = (self.CoordinatePointAY + self.CoordinatePointBY + self.CoordinatePointCY) / 3
            planar_centroid_z = (self.CoordinatePointAZ + self.CoordinatePointBZ + self.CoordinatePointCZ) / 3
            planar_centroid_xyz = (planar_centroid_x, planar_centroid_y, planar_centroid_z)
            return planar_centroid_xyz

        def incentre(self):
            a = math.sqrt((self.CoordinatePointBX - self.CoordinatePointCX) ** 2 + (
                    self.CoordinatePointBY - self.CoordinatePointCY) ** 2 + (
                                  self.CoordinatePointBZ - self.CoordinatePointCZ) ** 2)
            b = math.sqrt((self.CoordinatePointCX - self.CoordinatePointAX) ** 2 + (
                    self.CoordinatePointCY - self.CoordinatePointAY) ** 2 + (
                                  self.CoordinatePointCZ - self.CoordinatePointAZ) ** 2)
            c = math.sqrt((self.CoordinatePointAX - self.CoordinatePointBX) ** 2 + (
                    self.CoordinatePointAY - self.CoordinatePointBY) ** 2 + (
                                  self.CoordinatePointAZ - self.CoordinatePointBZ) ** 2)

            spatial_incentre_x = (
                                         a * self.CoordinatePointAX + b * self.CoordinatePointBX + c * self.CoordinatePointCX) / (
                                         a + b + c)
            spatial_incentre_y = (
                                         a * self.CoordinatePointAY + b * self.CoordinatePointBY + c * self.CoordinatePointCY) / (
                                         a + b + c)
            spatial_incentre_z = (
                                         a * self.CoordinatePointAZ + b * self.CoordinatePointBZ + c * self.CoordinatePointCZ) / (
                                         a + b + c)
            spatial_incentre_xyz = (spatial_incentre_x, spatial_incentre_y, spatial_incentre_z)
            return spatial_incentre_xyz

        def orthocentre(self):
            a = (self.CoordinatePointBX - self.CoordinatePointAX) * (
                    self.CoordinatePointCX - self.CoordinatePointAX) + (
                        self.CoordinatePointBY - self.CoordinatePointAY) * (
                        self.CoordinatePointCY - self.CoordinatePointAY) + (
                        self.CoordinatePointBZ - self.CoordinatePointAZ) * (
                        self.CoordinatePointCZ - self.CoordinatePointAZ)
            b = (self.CoordinatePointAX - self.CoordinatePointBX) * (
                    self.CoordinatePointCX - self.CoordinatePointBX) + (
                        self.CoordinatePointAY - self.CoordinatePointBY) * (
                        self.CoordinatePointCY - self.CoordinatePointBY) + (
                        self.CoordinatePointAZ - self.CoordinatePointBZ) * (
                        self.CoordinatePointCZ - self.CoordinatePointBZ)
            c = (self.CoordinatePointAX - self.CoordinatePointCX) * (
                    self.CoordinatePointBX - self.CoordinatePointCX) + (
                        self.CoordinatePointAY - self.CoordinatePointCY) * (
                        self.CoordinatePointBY - self.CoordinatePointCY) + (
                        self.CoordinatePointAZ - self.CoordinatePointCZ) * (
                        self.CoordinatePointBZ - self.CoordinatePointCZ)
            spatial_orthocentre_x = ((
                                             b * c * self.CoordinatePointAX + a * c * self.CoordinatePointBX + a * b * self.CoordinatePointCX) / (
                                             b * c + a * c + a * b))
            spatial_orthocentre_y = ((
                                             b * c * self.CoordinatePointAY + a * c * self.CoordinatePointBY + a * b * self.CoordinatePointCY) / (
                                             b * c + a * c + a * b))
            spatial_orthocentre_z = ((
                                             b * c * self.CoordinatePointAZ + a * c * self.CoordinatePointBZ + a * b * self.CoordinatePointCZ) / (
                                             b * c + a * c + a * b))
            spatial_orthocentre_xyz = (spatial_orthocentre_x, spatial_orthocentre_y, spatial_orthocentre_z)
            return spatial_orthocentre_xyz
```

{% note primary %}
由上，外心自己探究去吧
{% endnote %}
