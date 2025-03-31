//这里是写配方的地方
//函数文件要放在写配方文件的同一个文件夹下(可能)

ServerEvents.recipes(event => {
    //例1：物品右键方块，左右手拿钻石和锭右键石头掉落1个残骸，概率为1，最后一行是配方
    event.custom(
        lychee.use_item_on_block(
            [
                'minecraft:diamond',
                '#forge:ingots'
            ],
            'minecraft:stone',
            [
                //post.placeBlock('air', [0,0,0]),    //[]里是x,y,z偏移量，可以不写
                post.placeBlock('air'),
                post.dropItem('minecraft:ancient_debris', 1)
            ]
        )
    ).id('lychee:use_item_on_block/ancient_debris')
    
    event.custom(
        lychee.use_item_on_block(
            'minecraft:air',    //只有一个可以不加中括号
            'minecraft:stone',
            [
                post.placeBlock('air'),
                post.dropItem('minecraft:stone_sword', 1,
                    contextual.and([
                        contextual.is_sneaking(),
                        contextual.chance(0.5)
                    ]),
                    "{Enchantments:[{lvl:1s, id:\"minecraft:shapeness\"}]}"
                )
                /*
                {
                    type:'drop_item',
                    item:'minecraft:stone_sword',
                    count:1,
                    nbt:"{Enchantments:[{lvl:1s, id:\"minecraft:shapeness\"}]}",
                    contextual:contextual.is_sneaking()
                }
                    */
            ]
        )
    ).id('lychee:use_item_on_block/stone_sword')

    //例2:铁砧合成附魔金苹果
    event.custom(
        lychee.anvil_crafting(
            'apple',
            '8x gold_block',
            'enchanted_golden_apple',
            1,
            post.prevent_default() //只有一个可以不加中括号
        )
    ).id('lychee:anvil_crafting/enchanted_golden_apple')

    //例
    event.custom(
        lychee.anvil_crushing_on_landing_block(
            [
                'minecraft:stone',
                'minecraft:iron_ingot'
            ],
            [
                post.dropItem('minecraft:iron_ore',1,false,'{item:1b}')     //如果不填条件contextual，通过填false跳过这一项
            ],
            'sand'
        )
    ).id('lychee:anvil_crushing_on_landing_block/iron_ore')

    event.custom(
        lychee.anvil_crushing(
            [
                {
                    item:'coal',
                    nbt:'{coal:1b}'
                }
            ],
            [
                post.dropItem('minecraft:diamond',1, contextual.chance(0.5))
            ],
            contextual.location(
                {
                    block: {
                        blocks: [ 'minecraft:cauldron']
                    }
                },
                [0, -1, 0]
            )
        )
    ).id('lychee:anvil_crushing_on_landing_block/diamond_0')

    //例
    event.custom(
        lychee.item_inside(
            'minecraft:bucket',
            {
                blocks: ["water_cauldron"],
                state: {
                    level: 3
                }
            },
            [
                post.placeBlock('cauldron'),
                post.dropItem('water_bucket',1,contextual.chance(1))    //概率100%，不写contextual.chance(1)和写了效果一样
            ]
        )
    ).id('lychee:item_inside/water_bucket')

    //例
    event.custom(
        lychee.dripstone_dripping(
            'lava',
            'stone',
            post.placeBlock('minecraft:magma_block')
        )
    ).id('lychee/dripstone_dripping/magma_block')

    //例
    event.custom(
        lychee.lightning_channeling_item(
            'minecraft:glass_bottle',
            post.random(1,[
                //在post.random里使用的是 weighted PostAction
                //在这里的post.dropItem().weight()可以设置权重 (  只支持了post.dropItem()使用.weight()  )
                post.dropItem('minecraft:stone').weight(20),
                post.dropItem('minecraft:glass_bottle').weight(10)
            ])
        )
    ).id('lychee:lightning_channeling_item/experience_bottle')

    //例
    event.custom(
        lychee.item_burning(
            '#logs',
            post.dropItem('coal', 1)
        )
    ).id('lychee:item_burning/coal')

    //例 手持指定物品左键事件
    event.custom(
        lychee.click_block_with_item(
            //物品的object，如果是需要自定义的nbt，那就要这样写
            {
                //要有这个type才能写nbt,    'forge:partial_nbt'匹配部分nbt  'forge:nbt'匹配全部nbt
                //更多详细类型 https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
                type:'forge:partial_nbt',
                //物品id
                item:'minecraft:stone_sword',
                //物品nbt，使用/data get entity @s SelectedItem指令查看手持物品的资料里面的tag就是nbt
                nbt:"{Enchantments:[{lvl:1s, id:\"minecraft:shapeness\"}]}"
            },
            'grass_block',
            [
                post.placeBlock('air'),
                post.random(1,[
                    post.dropItem('dirt').weight(20),
                    post.dropItem('cobblestone').weight(10)
                ]),
                post.damage_item(1)
            ]
        )
    ).id('lychee:click_block_with_item/dirt')
})