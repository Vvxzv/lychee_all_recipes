# LycheeJS
## 这是可以在kubejs方便注册lychee配方的模组
### 使用例子
```JavaScript
ServerEvents.recipes(event => {
    // 建议配合probejs使用
    // 添加了4个Bindings: BlockPredicate, Post, Contextual, LocationPredicate 里面集成了官方文档给的大部分方法

    // 下列配方均是官方文档中的配方例子
    // 原JSON配方例子 https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#use-item-on-a-block
    event.recipes.lychee.block_interacting(
        'minecraft:shears', 
        'minecraft:pumpkin',
        Post.prevent_default()
    )

    event.recipes.lychee.block_interacting(
        'minecraft:iron_axe', 
        "minecraft:oak_log"
    )
    .post([
        // .withChance(0.5) 等效于 .contextual(Contextual.chance(0.5)) 
        Post.drop_item('minecraft:diamond').withChance(0.5), 
        Post.place("minecraft:stripped_oak_log"),
        Post.damage_item()
    ])


    // 原JSON配方例子 https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#item-entity-burning
    event.recipes.lychee.item_burning("#minecraft:logs_that_burn")
    .post(Post.drop_item("minecraft:charcoal"))


    // 原JSON配方例子 https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#item-entity-inside-a-block
    event.recipes.lychee.item_inside(
        "bucket",
        BlockPredicate.of("water_cauldron").withState("level", "3"), // 这种精确的数字需要填字符串
        [
            Post.drop_item('water_bucket'),
            Post.place('cauldron')
        ]
    )

    event.recipes.lychee.item_inside(
        "bucket",
        BlockPredicate.of('minecraft:water').withState("level", "0")
    ).post([
        Post.drop_item('water_bucket'),
        Post.place('*')
    ])


    // 原JSON配方例子 https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#item-entity-inside-a-block
    event.recipes.lychee.anvil_crafting(
        [
            "apple",
            "gold_ingot"
        ],
        "golden_apple"
    )
    .level_cost(1)
    .material_cost(8)
    .post(Post.prevent_default())


    // 原JSON配方例子 https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#block-crushing
    event.recipes.lychee.block_crushing(["minecraft:sugar_cane", "minecraft:sugar_cane", "minecraft:sugar_cane"])
    .post(Post.drop_item('3x paper'))

    event.recipes.lychee.block_crushing([]) //该输入物品是可选项，但是需要输入值，因此填个空数组
    .landing_block("minecraft:moss_carpet")
    .contextual(
        Contextual.location(
            LocationPredicate.of().block("stone_bricks")
        ).offsetY(-1) 
    )
    // 以下注释的内容和上方等效
    // .contextual( 
    //     Contextual.location({
    //         "block": {
    //             "blocks": [ "stone_bricks" ]
    //         }
    //     }).offsetY(-1) 
    // )
    .post([
        Post.place('*'),
        Post.place("mossy_stone_bricks").offsetY(-1)
    ])


    // 原JSON配方例子 https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#lightning-channeling
    event.recipes.lychee.lightning_channeling([])
    .post(Post.execute("fill ~-3 ~-3 ~-3 ~3 ~3 ~3 stone replace calcite"))


    // 原JSON配方例子 https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#dripstone-dripping
    event.recipes.lychee.dripstone_dripping("water", "sponge", Post.place("wet_sponge"))
})
```

---

# LycheeJS
## This is a mod that allows for easy registration of lychee recipes in kubejs
### Example
```JavaScript
ServerEvents.recipes(event => {
    // Recommend to use it with probejs.
    // Added four Bindings: BlockPredicate, Post, Contextual, LocationPredicate. It integrates most of the methods provided in the official documentation.

    // The following recipes are all examples from official documentation
    // Original JSON recipe example: https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#use-item-on-a-block
    event.recipes.lychee.block_interacting(
        'minecraft:shears', 
        'minecraft:pumpkin',
        Post.prevent_default()
    )

    event.recipes.lychee.block_interacting(
        'minecraft:iron_axe', 
        "minecraft:oak_log"
    )
    .post([
        // .withChance(0.5) equivalent to .contextual(Contextual.chance(0.5)) 
        Post.drop_item('minecraft:diamond').withChance(0.5), 
        Post.place("minecraft:stripped_oak_log"),
        Post.damage_item()
    ])


    // Original JSON recipe example: https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#item-entity-burning
    event.recipes.lychee.item_burning("#minecraft:logs_that_burn")
    .post(Post.drop_item("minecraft:charcoal"))


    // Original JSON recipe example: https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#item-entity-inside-a-block
    event.recipes.lychee.item_inside(
        "bucket",
        // "3" This precise number needs to be filled with a string
        BlockPredicate.of("water_cauldron").withState("level", "3"), 
        [
            Post.drop_item('water_bucket'),
            Post.place('cauldron')
        ]
    )

    event.recipes.lychee.item_inside(
        "bucket",
        BlockPredicate.of('minecraft:water').withState("level", "0")
    ).post([
        Post.drop_item('water_bucket'),
        Post.place('*')
    ])


    // Original JSON recipe example: https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#item-entity-inside-a-block
    event.recipes.lychee.anvil_crafting(
        [
            "apple",
            "gold_ingot"
        ],
        "golden_apple"
    )
    .level_cost(1)
    .material_cost(8)
    .post(Post.prevent_default())


    // Original JSON recipe example: https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#block-crushing
    event.recipes.lychee.block_crushing(["minecraft:sugar_cane", "minecraft:sugar_cane", "minecraft:sugar_cane"])
    .post(Post.drop_item('3x paper'))

    // The input item is optional, but a value needs to be entered, so a null array needs to be filled
    event.recipes.lychee.block_crushing([]) 
    .landing_block("minecraft:moss_carpet")
    .contextual(
        Contextual.location(
            LocationPredicate.of().block("stone_bricks")
        ).offsetY(-1) 
    )
    // The content of the following note is equivalent to the one above
    // .contextual( 
    //     Contextual.location({
    //         "block": {
    //             "blocks": [ "stone_bricks" ]
    //         }
    //     }).offsetY(-1) 
    // )
    .post([
        Post.place('*'),
        Post.place("mossy_stone_bricks").offsetY(-1)
    ])


    // Original JSON recipe example: https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#lightning-channeling
    event.recipes.lychee.lightning_channeling([])
    .post(Post.execute("fill ~-3 ~-3 ~-3 ~3 ~3 ~3 stone replace calcite"))


    // Original JSON recipe example: https://lycheetweaker.readthedocs.io/en/docs-1.20/recipe/#dripstone-dripping
    event.recipes.lychee.dripstone_dripping("water", "sponge", Post.place("wet_sponge"))
})
```