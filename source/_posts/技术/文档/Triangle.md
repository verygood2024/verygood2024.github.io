---
title: Triangle-calculations-yes库文档
tags:
- 技术
excerpt: 备忘录
description: Triangle-calculations-yes支持计算面积、周长、重心、外心、内心、垂心、费马点、拿破仑点
copyright_author: 李岚霏
author: 李岚霏
copyright_author_href: /categories/作者/李岚霏/
comment: gitalk
top_img: /img/img/py.jpg
cover: /img/img/py.jpg
sticky: 85
categories:
- - 技术
  - 文档
abbrlink: f9c2377f
date: 2024-08-01 17:00:40
---
## 介绍

&emsp;&emsp;Triangle-calculations-yes支持计算**面积、周长、重心、外心、内心、垂心、费马点、拿破仑点**

&emsp;&emsp;其中**费马点**使用退火算法近似

## 开始

{% note success %}
安装：pip install Triangle-calculations-yes
{% endnote %}

## CircumferenceAndArea三角形周长或面积

```python
from Triangle_calculations_yes import CircumferenceAndArea#导入
triangle_calculator = CircumferenceAndArea(a=0, b=0, c=0, bottom=0, high=0, pax=0, pbx=0, pcx=0, pay=0, pby=0, pcy=0, paz=0, pbz=0, pcz=0,getparms=0, dimensionality=0,decimal=0)#实例化
```

### 周长

#### circumference

输入三边长度

```python
from Triangle_calculations_yes import CircumferenceAndArea#导入
triangle_calculator = CircumferenceAndArea(a=0, b=0, c=0)#实例化
print(triangle_calculator.circumference())
```

#### circumference_points

输入点坐标

```python
from Triangle_calculations_yes import CircumferenceAndArea#导入
'''
pax某点的x轴上的坐标，以此类推
dimensionality维度，仅限2或3维
'''
triangle_calculator=CircumferenceAndArea(pax=0,pbx=0,pcx=0,pay=0,pby=0,pcy=0,paz=0,pbz=0,pcz=0,dimensionality=0)#实例化
print(triangle_calculator.circumference_points())
```

### 面积

#### area_is_bottom_high

输入底边长和高

```python
from Triangle_calculations_yes import CircumferenceAndArea#导入
triangle_calculator=CircumferenceAndArea(bottom=0, high=0)#实例化
print(triangle_calculator.area_is_bottom_high())
```



#### area_is_sides

输入三边长度

```python
from Triangle_calculations_yes import CircumferenceAndArea#导入
triangle_calculator=CircumferenceAndArea(a=0, b=0, c=0)#实例化
print(triangle_calculator.area_is_sides())
```

#### area_is_planar_vector

输入点坐标【仅限二维】

```python
from Triangle_calculations_yes import CircumferenceAndArea#导入
'''
pax某点的x轴上的坐标，以此类推
'''
triangle_calculator=CircumferenceAndArea(pax=0,pbx=0,pcx=0,pay=0,pby=0,pcy=0)#实例化
print(triangle_calculator.area_is_planar_vector())
```

#### area_is_spatial_vectors

输入点坐标【仅限三维】

```python
from Triangle_calculations_yes import CircumferenceAndArea#导入
'''
pax某点的x轴上的坐标，以此类推
'''
triangle_calculator=CircumferenceAndArea(pax=0,pbx=0,pcx=0,pay=0,pby=0,pcy=0,paz=0,pbz=0,pcz=0)#实例化
print(triangle_calculator.area_is_spatial_vectors())
```

## TriangleCentres三角形四心

### centroid重心

```python
from Triangle_calculations_yes import TriangleCentres#导入
'''
pax某点的x轴上的坐标，以此类推
dimensionality维度，仅限2或3维
'''
triangle_calculator=TriangleCentres(pax=0,pbx=0,pcx=0,pay=0,pby=0,pcy=0,paz=0,pbz=0,pcz=0,dimensionality=0)#实例化
print(triangle_calculator.centroid())
```

### incentre内心

```python
from Triangle_calculations_yes import TriangleCentres#导入
'''
pax某点的x轴上的坐标，以此类推
dimensionality维度，仅限2或3维
'''
triangle_calculator=TriangleCentres(pax=0,pbx=0,pcx=0,pay=0,pby=0,pcy=0,paz=0,pbz=0,pcz=0,dimensionality=0)#实例化
print(triangle_calculator.incentre())
```

### orthocentre垂心

```python
from Triangle_calculations_yes import TriangleCentres#导入
'''
pax某点的x轴上的坐标，以此类推
dimensionality维度，仅限2或3维
'''
triangle_calculator=TriangleCentres(pax=0,pbx=0,pcx=0,pay=0,pby=0,pcy=0,paz=0,pbz=0,pcz=0,dimensionality=0)
print(triangle_calculator.orthocentre())
```

### circumcentre外心

```python
from Triangle_calculations_yes import TriangleCentres#导入
'''
pax某点的x轴上的坐标，以此类推
dimensionality维度，仅限2或3维
'''
triangle_calculator=TriangleCentres(pax=0,pbx=0,pcx=0,pay=0,pby=0,pcy=0,paz=0,pbz=0,pcz=0,dimensionality=0)
print(triangle_calculator.circumcentre())
```

## FermatProblem费马点

```python
from Triangle_calculations_yes import FermatProblem#导入
'''
pax某点的x轴上的坐标，以此类推
dimensionality维度，仅限2或3维
'''
triangle_calculator=FermatProblem(pax=0,pbx=0,pcx=0,pay=0,pby=0,pcy=0,paz=0,pbz=0,pcz=0,dimensionality=0)#实例化
print(triangle_calculator.fermat_problem())
```

## NapoleonicTriangle拿破仑点

该方法未测试过

```python
from Triangle_calculations_yes import NapoleonicTriangle#导入
'''
pax某点的x轴上的坐标，以此类推
dimensionality维度，仅限2或3维
'''
triangle_calculator=NapoleonicTriangle(pax=0,pbx=0,pcx=0,pay=0,pby=0,pcy=0,paz=0,pbz=0,pcz=0,dimensionality=0)#实例化
print(triangle_calculator.napoleonic_triangle())
```

