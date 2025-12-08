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
                post.dropItem('minecraft:ancient_debris')
            ]
        )
    ).id('lychee:use_item_on_block/ancient_debris')
    
    event.custom(
        lychee.use_item_on_block(
            'minecraft:air',    //只有一个可以不加中括号
            'minecraft:stone',
            [
                post.placeBlock('air'),
                post.dropItem(
                    Item.of('minecraft:stone_sword').enchant('sharpness', 1),
                    contextual.and([
                        contextual.is_sneaking(),
                        contextual.chance(0.5)
                    ])
                )
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

    //例3
    event.custom(
        lychee.anvil_crushing_on_landing_block(
            [
                'minecraft:stone',
                'minecraft:iron_ingot'
            ],
            [
                post.dropItem('minecraft:iron_ore')
            ],
            'minecraft:sand'
        )
    ).id('lychee:anvil_crushing_on_landing_block/iron_ore')

    //例4
    event.custom(
        lychee.anvil_crushing(
            Item.of('minecraft:coal', '{coal:1b}'),
            [
                post.dropItem('minecraft:diamond', contextual.chance(0.5))
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

    //例5
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
                post.dropItem('water_bucket', contextual.chance(1))    //概率100%
            ]
        )
    ).id('lychee:item_inside/water_bucket')

    //例6
    event.custom(
        lychee.dripstone_dripping(
            'lava',
            'stone',
            post.placeBlock('minecraft:magma_block')
        )
    ).id('lychee/dripstone_dripping/magma_block')

    //例7
    event.custom(
        lychee.lightning_channeling_item(
            'minecraft:glass_bottle',
            post.random(1, [
                //在post.random里使用的是 weighted PostAction
                post.dropItem('minecraft:stone', false, 20),
                post.dropItem('minecraft:glass_bottle', false, 10)
            ])
        )
    ).id('lychee:lightning_channeling_item/experience_bottle')

    //例8
    event.custom(
        lychee.item_burning(
            '#logs',
            post.dropItem('coal')
        )
    ).id('lychee:item_burning/coal')

    //例9 手持指定物品左键事件
    event.custom(
        lychee.click_block_with_item(
            {
                //要有这个type才能写nbt,    'forge:partial_nbt'匹配部分nbt  'forge:nbt'匹配全部nbt
                //或者也可以
                // Item.of('stone_sword').enchant('sharpness', 1).weakNBT()
                // 但是要注意这样写nbt会多了{Damage:0} 因此剑掉耐久了就不满足nbt了
                //更多详细类型 https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
                type:'forge:partial_nbt',
                //物品id
                item:'minecraft:stone_sword',
                //物品nbt，使用/data get entity @s SelectedItem指令查看手持物品的资料里面的tag就是nbt
                nbt:"{Enchantments:[{lvl:1s, id:\"minecraft:sharpness\"}]}"
            },
            'grass_block',
            [
                post.placeBlock('air'),
                post.random(1, [
                    post.dropItem('dirt', false, 20),
                    post.dropItem('cobblestone', false, 10)
                ]),
                post.damage_item(1)
            ]
        )
    ).id('lychee:click_block_with_item/dirt')
})