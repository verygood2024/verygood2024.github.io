---
title: Minecraft-java-Forge-mod开发
tags:
- 技术
excerpt: 基础
author: 李岚霏
comment: gitalk
copyright_author: 李岚霏
copyright_author_href: /categories/作者/李岚霏/
sticky: 25
categories:
- - 技术
- - 作者
  - 李岚霏
abbrlink: 7464de4b
date: 2024-06-11 19:00:20
---

## 有用的链接

[MinecraftDeveloperGuide](https://mouse0w0.github.io/MinecraftDeveloperGuide/#java%E5%9F%BA%E7%A1%80)

## 开始

**1.0.** 你需要基本的英语水平

**1.1.** [Minecraft Forge](https://files.minecraftforge.net)下载MDK（全称Mod Development Kit）

**1.2.** 下载好后，打开对应文件夹IDE应该会自动下载导入配置开发环境，若未自动配置开发环境，请点击运行`build.gradle`

**过程许久，国内网络凭运气成功，一般几个小时到几天是常有的事**

## 基本

### gradle.properties

```properties
由此为起之上,多不变

mod_id=mod_id|它是唯一的

mod_name=mod名

mod_license=许可证

mod_version=mod的版本

mod_group_id=mod的组id，它只在作为工件发布到maven仓库时才重要,应匹配用于mod源的基本包

mod_authors=作者名

mod_description=mod简介
```

### mods.toml

gradle.properties的设置,也可在`mods.toml`中设置

- `modId`:mod_id|它是唯一的
- `version`:mod的版本
- `displayName`:mod名
- `displayURL`:mod介绍网页的链接
- `logoFile`:mod图标
- `credits`:mod致谢名单
- `authors`:mod作者名单
- `description`:mod简介

### Mod

下载好后会自带一个***Mod文件
建议改成如下

```java
@Mod(Mod.MOD_ID)
public class 文件夹名
{
public static final String MOD_ID = 与modId中的设置相同;
private static final Logger LOGGER = LogUtils.getLogger();

    public 随便取() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();

        在此注册你的东西

        MinecraftForge.EVENT_BUS.register(this);
        modEventBus.addListener(this::addCreative);
    }


    private void addCreative(BuildCreativeModeTabContentsEvent event)
    {
    }

    @SubscribeEvent
    public void onServerStarting(ServerStartingEvent event)
    {
    }


    @Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
    public static class ClientModEvents
    {
        @SubscribeEvent
        public static void onClientSetup(FMLClientSetupEvent event)
        {
        }
    }
}
```

## 第一个物品

```java
public class 文件名 {
    public static final DeferredRegister<Item> 随便定1 =
            DeferredRegister.create(ForgeRegistries.ITEMS, Mod.MOD_ID);

    public static final RegistryObject<Item> 随便定2 = 随便定1.register(随便定3-必须小写,
            () -> new Item(new Item.Properties()));

    public static void register(IEventBus eventBus) {
        ITEMS.register(eventBus);
    }
}
```

{% note danger %}
暂收
{% endnote %}
