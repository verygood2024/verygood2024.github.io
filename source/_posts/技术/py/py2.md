---
title: Python内置函数
tags:
- 技术
author: 李岚霏
excerpt: 没啥用
comment: gitalk
sticky: 22
copyright_author: 李岚霏
copyright_author_href: /categories/作者/李岚霏/
banner_img: /img/py.jpg
top_img: /img/img/py.jpg
categories:
- - 技术
- - 作者
  - 李岚霏
abbrlink: d59aed63
date: 2024-06-09 16:00:00
---

## 内置函数

--|--||--|--
:--:|:--:|:--:|:--:|:--:
[abs()](https://www.runoob.com/python/func-number-abs.html)|返回绝对值||[divmod()](https://www.runoob.com/python/python-func-divmod.html)|将除数和余数结合成一个元组
[input()](https://www.runoob.com/python/python-func-input.html)|输入数据后返回string类型||[open()](https://www.runoob.com/python/python-func-open.html)|打开文件
[staticmethod()](https://www.runoob.com/python/python-func-staticmethod.html)|返回函数的静态方法||[all()](https://www.runoob.com/python/python-func-all.html)|判断给定的可迭代参数iterable中所有元素是否存在0、空、None、False；若有返回False，反之返回True
[enumerate()](https://www.runoob.com/python/python-func-enumerate.html)|将一个可迭代对象组合为一个索引序列，返回结果为一个元组，包含索引和对应的元素||[int()](https://www.runoob.com/python/python-func-int.html)|转换字符串或数字为整型
[ord()](https://www.runoob.com/python/python-func-ord.html)|返回一个字符的Unicode码点||[str()](https://www.runoob.com/python/python-func-str.html)|字符串
[any()](https://www.runoob.com/python/python-func-any.html)|判断给定的可迭代参数iterable中所有元素是否全为0、空、None、False；若是返回False，反之返回True||[eval()](https://www.runoob.com/python/python-func-eval.html)|执行一个字符串表达式，并返回表达式的值
[isinstance()](https://www.runoob.com/python/python-func-isinstance.html)|判断对象类型||[pow()](https://www.runoob.com/python/func-number-pow.html)|计算数的次方的值
[sum()](https://www.runoob.com/python/python-func-sum.html)|对序列求和||[execfile()](https://www.runoob.com/python/python-func-execfile.html)|执行一个文件
[issubclass()](https://www.runoob.com/python/python-func-issubclass.html)|判断class是否是类型参数classinfo的子类||[print()](https://www.runoob.com/python/python-func-print.html)|打印输出
[super()](https://www.runoob.com/python/python-func-super.html)|调用父类的一个方法||[bin()](https://www.runoob.com/python/python-func-bin.html)|返回一个int或long int的二进制表示。
[iter()](https://www.runoob.com/python/python-func-iter.html)|生成迭代器||[property()](https://www.runoob.com/python/python-func-property.html)|获取属性值，设置属性值，删除属性，属性文档字符串
[tuple()](https://www.runoob.com/python/att-tuple-tuple.html)|将列表转换为元组||[bool()](https://www.runoob.com/python/python-func-bool.html)|将给定参数转换为布尔类型，若无参数，返回 False
[filter()](https://www.runoob.com/python/python-func-filter.html)|过滤序列，返回新列表||[len()](https://www.runoob.com/python/att-string-len.html)|返回对象长度或项目个数
[range()](https://www.runoob.com/python/python-func-range.html)|创建一个整数列表||[type()](https://www.runoob.com/python/python-func-type.html)|传递一个参数时返回对象类型，三个参数时返回新类型对象
[bytearray()](https://www.runoob.com/python/python-func-bytearray.html)|返回一个新字节数组。此数组中元素可变，并每个元素值范围在：0 <= x < 256||[float()](https://www.runoob.com/python/python-func-float.html)|转换整数或字符串为浮点数
[list()](https://www.runoob.com/python/att-list-list.html)|将元组转换为列表||[callable()](https://www.runoob.com/python/python-func-callable.html)|检查一个对象是否可调用
[format()](https://www.runoob.com/python/att-string-format.html)|格式化字符串||[locals()](https://www.runoob.com/python/python-func-locals.html)|以字典类型返回当前位置的全部局部变量
[reduce()](https://www.runoob.com/python/python-func-reduce.html)|对参数序列中元素进行累积||[chr()](https://www.runoob.com/python/python-func-chr.html)|用一个范围在0～255内的整数作参数，返回一个对应的字符。
[frozenset()](https://www.runoob.com/python/python-func-frozenset.html)|返回一个冻结的集合||[reload()](https://www.runoob.com/python/python-func-reload.html)|重新载入之前载入的模块
[vars()](https://www.runoob.com/python/python-func-vars.html)|返回对象object的属性和属性值的字典对象||[classmethod()](https://www.runoob.com/python/python-func-classmethod.html)|其所对应函数不需要实例化，不需要 self 参数，但第一个参数要是表示自身类的 cls 参数
[getattr()](https://www.runoob.com/python/python-func-getattr.html)|返回一个对象属性值||[map()](https://www.runoob.com/python/python-func-map.html)|根据提供的函数对指定序列做映射
[repr()](https://www.runoob.com/python/python-func-repr.html)|将对象转化为供解释器读取的形式，生成数组||[xrange()](https://www.runoob.com/python/python-func-xrange.html)|将对象转化为供解释器读取的形式，生成生成器
[cmp()](https://www.runoob.com/python/func-number-cmp.html)|比较2个对象||[globals()](https://www.runoob.com/python/python-func-globals.html)|以字典类型返回当前位置的全部全局变量
[max()](https://www.runoob.com/python/func-number-max.html)|返回给定参数的最大值，参数可以为序列||[reverse()](https://www.runoob.com/python/att-list-reverse.html)|将列表元素反向
[zip()](https://www.runoob.com/python/python-func-zip.html)|将可迭代对象作参数，其中对应元素打包成一个个元组，后返回由这些元组组成的列表||[compile()](https://www.runoob.com/python/python-func-compile.html)|将一个字符串编译为字节代码
[hasattr()](https://www.runoob.com/python/python-func-hasattr.html)|判断对象是否包含对应的属性||[memoryview()](https://www.runoob.com/python/python-func-memoryview.html)|返回给定参数的内存查看对象
[round()](https://www.runoob.com/python/func-number-round.html)|返回浮点数x的四舍五入值||[import()](https://www.runoob.com/python/python-func-__import__.html)|动态加载类和函数
[complex()](https://www.runoob.com/python/python-func-complex.html)|创建一个值为 real + imag * j 的复数或者转化一个字符串或数为复数||[hash()](https://www.runoob.com/python/python-func-hash.html)|获取一个对象的哈希值
[min()](https://www.runoob.com/python/func-number-min.html)|返回给定参数的最小值，参数可以为序列||[set()](https://www.runoob.com/python/python-func-set.html)|创建一个无序不重复元素集
[delattr()](https://www.runoob.com/python/python-func-delattr.html)|删除属性||[help()](https://www.runoob.com/python/python-func-help.html)|查看函数或模块用途的详细说明
[next()](https://www.runoob.com/python/python-func-next.html)|返回迭代器的下一个项目，需要list()||[setattr()](https://www.runoob.com/python/python-func-setattr.html)|设置属性值
[dict()](https://www.runoob.com/python/python-func-dict.html)|创建一个字典||[hex()](https://www.runoob.com/python/python-func-hex.html)|将10进制整数转换成16进制，以字符串形式表示
[object()](https://www.runoob.com/python3/python-func-object.html)|返回一个空对象||[slice()](https://www.runoob.com/python/python-func-slice.html)|切片对象
[dir()](https://www.runoob.com/python/python-func-dir.html)|不带参数时，返回当前范围内的变量、方法和定义的类型列表；带参数时，返回参数的属性、方法列表。如果参数包含方法__dir__()||[id()](https://www.runoob.com/python/python-func-id.html)|返回对象的唯一标识符，标识符是一个整数
[oct()](https://www.runoob.com/python/python-func-oct.html)|将一个整数转换成 8 进制字符串||[sorted()](https://www.runoob.com/python/python-func-sorted.html)|对所有可迭代的对象进行排序操作
[exec](https://www.runoob.com/python/python-func-exec.html) |内置表达式||[file()](https://www.runoob.com/python/python-func-file.html)|创建一个 file 对象