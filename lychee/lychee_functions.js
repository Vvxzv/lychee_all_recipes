//Edited by Vvxzv
//lychee for minecraft ver 1.20.1 forge

//这里是编写函数的地方
//函数使用例子在另一个文件
//写配方的文件要放在和这个函数文件同一个文件夹下(可能)

var lychee = {}
var contextual = {}
var post = {}

//检测字符串第一个字符是否为数字
function isFirstCharDigit(str) {
    return !isNaN(str.charAt(0)) && str.charAt(0) !== ' ';
}

//更换 item 类型
/**
 * 
 * @param {*} item 更多详细类型 https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @returns 
 */
function item_type(item){
    let input = Array.isArray(item) ? item : [item]
    let output = input.map(item => {
        if (typeof item === 'object' && !Array.isArray(item)) {
            return item
        } 
        else if (typeof item === 'string' && item.startsWith("#")) {
            return { tag: item.slice(1) }
        } 
        else if (typeof item === 'string') {
            return { item: item }
        }
    })
    return output
}

/**
 * 
 * @param {number} chance 
 * @returns 
 */
contextual.chance = (chance) => ({
    type: "chance", 
    chance: chance 
})

/**
 * 
 * @param {function} contextual condition
 * @returns 
 */
contextual.not = (contextual) => ({
    type: "not", 
    contextual:contextual
})

/**
 * 
 * @param {function} contextual condition 
 * @returns 
 */
contextual.or = (contextual) => ({
    type: "or", 
    contextual:Array.isArray(contextual)?contextual:[contextual]
})

/**
 * @param {[function]} contextual condition
 * @returns
 */
contextual.and = (contextual) => ({
    type: "and", 
    contextual:Array.isArray(contextual)?contextual:[contextual]
})

/**
 * 
 * @param {JSON} predicate https://minecraft.wiki/w/Advancement/Conditions/location?oldid=2481474
 * @param {[int,int,int]} offset [offsetX, offsetY, offsetZ]
 * @returns 
 */
contextual.location = function(predicate, offset){
    let data = {
        type:"location",
        predicate:predicate
    }
    if(offset != undefined){
        data.offsetX = offset[0]
        data.offsetY = offset[1]
        data.offsetZ = offset[2]
    }
    return data
}

/**
 * 
 * @param {"clear" | "rain" | "thunder"} weather 
 * @returns 
 */
contextual.weather = (weather) => ({
    type: "weather",
    weather:weather
})

/**
 * 
 * @param {string} difficulty string | int | string[] | int[]
 * @returns 
 */
contextual.difficulty = (difficulty) => ({
    type: "difficulty",
    difficulty:difficulty
})

/**
 * 
 * @param {int} time int | [ int(min), int(max) ]
 * @param {int} period 
 * @returns 
 */
contextual.time = (time, period) => ({
    type: "time",
    value:Array.isArray(time) ? {min:time[0],max:time[1]} : time,
    period:period
})

/**
 * 
 * @param {string} command 
 * @param {IntBounds} value int | [int(min), int(max)]
 * @returns 
 */
contextual.execute = (command, value) => ({
    type: "execute",
    command:command,
    value:Array.isArray(value) ? {min:value[0],max:value[1]} : value
})

/**
 * 
 * @param {DoubleBounds} fall_distance_range number | [number(min), number(max)]
 * @returns 
 */
contextual.fall_distance = (fall_distance_range) => ({
    type: "fall_distance",
    range:Array.isArray(fall_distance_range) ? {min:fall_distance_range[0],max:fall_distance_range[1]} : fall_distance_range
})

/**
 * 
 * @param {DoubleBounds} entity_health_range number | [number(min), number(max)]
 * @param {function} contextual optional
 * @returns 
 */
contextual.entity_health = (entity_health_range) => ({
    type: "entity_health",
    range:Array.isArray(entity_health_range) ? {min:entity_health_range[0],max:entity_health_range[1]} : entity_health_range
})

contextual.is_sneaking = () => ({
    type: "is_sneaking"
})

/**
 * 
 * @param {"up" | "down" | "north" | "south" | "east" | "west" | "side" | "forward"} direction
 * @returns 
 */
contextual.direction = (direction) => ({
    type: "direction",
    direction:direction
})

/**
 * 
 * @param {string} key parameter name
 * @returns 
 */
contextual.check_param = (key) => ({
    type: "check_param",
    key:key
})

/**
 * 
 * @param {string} item 
 * @param {int} count default 1
 * @param {function} contextual optional
 * @param {string} nbt optional
 * @returns 
 */
post.dropItem = function(item, count, contextual, nbt){
    let data = {
        type: "drop_item",
        item: item
    }
    data.weight = function(weightValue) {
        if (weightValue != undefined && weightValue !== false) {
            data.weight = weightValue
        }
        return data
    }
    if(count != undefined && count != false ) data.count = count
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    if(nbt != undefined && nbt != false ) data.nbt = nbt
    return data
}

/**
 * 
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {[int,int,int]} offset [offsetX, offsetY, offsetZ] optional
 * @param {function} contextual optional
 * @returns 
 */
post.placeBlock = function(block, offset, contextual){
    let data = {
        type: "place",
        block: block
    }
    if(offset != undefined && offset != false ){
        data.offsetX = offset[0]
        data.offsetY = offset[1]
        data.offsetZ = offset[2]
    }
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {int} count 
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.20/post-action/#damage-item
 * @param {function} contextual optional
 */
post.damage_item = function(count, contextual){
    let data = {
        type: "damage_item"
    }
    if(count != undefined && count != false ) data.count = count
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {string} command 
 * @param {boolean} hide default false
 * @param {boolean} repeat default true
 * @param {function} contextual optional
 * @returns 
 */
post.execute = function(command, hide, repeat, contextual){
    let data = {
        type: "execute",
        command:command
    }
    if(hide != undefined && hide != false ) data.hide = hide
    if(repeat != undefined && repeat != false ) data.repeat = repeat
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {int} xp 
 * @param {function} contextual optional
 * @returns 
 */
post.drop_xp = function(xp, contextual){
    let data = {
        type: "drop_xp",
        xp:xp
    }
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {IntBounds} rolls [0,2] => [min, max]
 * @param {[]} entries Weighted postAction[]
 * @param {function} contextual optional
 * @returns 
 */
post.random = function(rolls, entries, contextual){
    let data = {
        type: "random",
        rolls:Array.isArray(rolls)?{min: rolls[0],max: rolls[1]}:rolls,
        entries:Array.isArray(entries)?entries:[entries]
    }
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {PostAction} then
 * @param {PostAction} other
 * @returns 
 */
post.if = function(then, other){
    let data = {
        type: "if"
    }
    if(then != undefined && then != false ) data.then = Array.isArray(then)?then:[then]
    if(other != undefined && other != false ) data.else = Array.isArray(other)?other:[other]
    return data
}

/**
 * 
 * @param {[int,int,int]} offset [offsetX, offsetY, offsetZ]
 * @param {boolean} fire default false
 * @param {"destroy" | "keep" | "destroy_with_decay"} block_interaction default "destroy"
 * @param {number} radius default 4
 * @param {number} radius_step default 0.5
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.20/post-action/#create-explosion
 * @param {function} contextual optional
 */
post.explode = function(offset, fire, block_interaction, radius, radius_step, contextual){
    let data = {
        type:"explode"
    }
    if(offset != undefined && offset != false){
        data.offsetX = offset[0]
        data.offsetY = offset[1]
        data.offsetZ = offset[2]
    }
    if(fire != undefined && fire != false ) data.fire = fire
    if(block_interaction != undefined && block_interaction != false ) data.block_interaction = block_interaction
    if(radius != undefined && radius != false ) data.radius = radius
    if(radius_step != undefined && radius_step != false ) data.radius_step = radius_step
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {number} chance 0.0-1.0
 * @param {function} contextual optional
 * @returns 
 */
post.anvil_damage_chance = function(chance, contextual){
    let data = {
        type:"anvil_damage_chance",
        chance:chance
    }
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {DoubleBounds} damage 
 * @param {string} source default "generic" 
 * @param {function} contextual optional
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.20/post-action/#hurt-entity
 */
post.hurtEntity = function(damage, source, contextual){
    let data = {
        type:"hurt",
        damage:Array.isArray(damage)?[damage[0],damage[1]]:damage
    }
    if(source != undefined && source != false ) data.source = source
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {number} chance 
 * @param {function} contextual optional
 * @returns 
 */
post.anvil_damage_chance = function(chance, contextual){
    let data = {
        type:"anvil_damage_chance",
        chance:chance
    }
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {number} seconds 
 * @param {function} contextual optional
 * @returns 
 */
post.add_item_cooldown = function(seconds, contextual){
    let data = {
        type:"add_item_cooldown",
        s:seconds
    }
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {number} factor default 1
 * @param {function} contextual optional
 * @returns 
 */
    
post.move_towards_face = function(factor, contextual){
    let data = {
        type:"move_towards_face"
    }
    if(factor != undefined && factor != false ) data.factor = factor
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

/**
 * 
 * @param {number} seconds 
 * @param {function} contextual optional
 * @returns 
 */
post.delay = function(seconds, contextual){
    let data = {
        type:"delay",
        s:seconds
    }
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

post.break = () => ({
    type:"break"
})

/**
 * 
 * @param {BlockPredicate} block 
 * @param {string} property 
 * @param {[int,int,int]} offset [offsetX, offsetY, offsetZ] optional
 * @param {function} contextual optional
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.20/post-action/#cycle-state-property
 */
post.cycle_state_property = function(block, property, offset, contextual){
    let data = {
        type:"cycle_state_property",
        block:block,
        property:property
    }
    if(offset != undefined && offset != false){
        data.offsetX = offset[0]
        data.offsetY = offset[1]
        data.offsetZ = offset[2]
    }
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    return data
}

post.prevent_default = () => ({
    type: "prevent_default"
})

/**
 * 
 * @param {string} item 
 * @param {int} count default 1
 * @param {function} contextual optional
 * @param {string} nbt optional
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.20/post-action/#set-item
 */
post.setItem = function(item, count, contextual, nbt){
    let data = {
        type:"set_item",
        item:item
    }
    if(count != undefined && count != false ) data.count = count
    if(contextual != undefined && contextual != false ) data.contextual = contextual
    if(nbt != undefined && nbt != false ) data.nbt = nbt
    return data
}

//lychee function
/**
 * 
 * @param {[string]} item   custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {[function]} postActions [post.drop_item(item, count, chance),...]
 * @param {function} contextual condition (optional)
 */
lychee.use_item_on_block = function(item, block, postActions, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_interacting",
        item_in: itemin,
        block_in: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {[function]} postActions [post.drop_item(item, count, chance),...]
 * @param {function} contextual condition (optional)
 */
lychee.click_block_with_item = function(item, block, postActions, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_clicking",
        item_in: itemin,
        block_in: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {[function]} postActions [post.drop_item(item, count, chance),...]
 * @param {function} contextual condition (optional)
 */
lychee.item_burning = function(item, postActions, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:item_burning",
        item_in: itemin,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 *
 * @param {[string]} item    custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {[function]} postActions [post.drop_item(item, count, chance),...]
 * @param {function} contextual condition (optional)
 */
lychee.item_inside = function(item, block, postActions, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:item_inside",
        item_in:itemin,
        block_in: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {string} item Item Id 'minecraft:apple'
 * @param {string} material 'minecraft:apple' or '3x minecraft:apple'
 * @param {string} result 
 * @param {int} level_cost 
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {function} contextual condition (optional)
 */
lychee.anvil_crafting = function(item, material, result, level_cost, postActions, contextual){
    let material_cost = 1
    if(isFirstCharDigit(material)){
        material_cost = +material[0]
        material = material.split(' ')[1]
    }
    let itemin = [item, material]
    let eventData = {
        type: "lychee:anvil_crafting",
        item_in: item_type(itemin),
        item_out: { item: result },
        level_cost: level_cost,
        material_cost: material_cost,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {[function]} postActions [post.drop_item(item, count, chance),...]
 * @param {function} contextual condition (optional)
 */
lychee.anvil_crushing = function(item, postActions, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_crushing",
        item_in:itemin,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {BlockPredicate} falling_block 
 * https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {function} contextual condition (optional)
 */
lychee.falling_block_crushing = function(item, postActions, falling_block, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_crushing",
        item_in:itemin,
        post: Array.isArray(postActions) ? postActions : [postActions],
        falling_block:falling_block
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {BlockPredicate} landing_block 
 * https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {function} contextual condition (optional)
 */
lychee.anvil_crushing_on_landing_block = function(item, postActions, landing_block, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_crushing",
        item_in:itemin,
        post: Array.isArray(postActions) ? postActions : [postActions],
        landing_block:landing_block
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {BlockPredicate} landing_block 
 * https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {BlockPredicate} falling_block 
 * https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {function} contextual condition (optional)
 */
lychee.falling_block_crushing_on_landing_block = function(item, postActions, falling_block, landing_block, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_crushing",
        item_in:itemin,
        post: Array.isArray(postActions) ? postActions : [postActions],
        landing_block:landing_block,
        falling_block:falling_block
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}


/**
 * 
 * @param {[string]} item   custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {function} contextual condition (optional)
 */
lychee.lightning_channeling_item = function(item, postActions, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:lightning_channeling",
        item_in: itemin,
        post:  Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {function} contextual condition (optional)
 */
lychee.lightning_channeling = function(postActions, contextual){
    let eventData = {
        type: "lychee:lightning_channeling",
        post:  Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://docs.minecraftforge.net/en/1.19.x/resources/server/recipes/ingredients/#forge-types
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {function} contextual condition (optional)
 */
lychee.item_exploding = function(item, postActions, contextual){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:item_exploding",
        item_in:itemin,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {function} contextual condition (optional)
 */
lychee.block_exploding = function(block, postActions, contextual){
    let eventData = {
        type: "lychee:block_exploding",
        block_in:block,
        post:  Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {BlockPredicate} fluid https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {function} contextual condition (optional)
 */
lychee.dripstone_dripping = function(fluid, block, postActions, contextual){
    let eventData = {
        type: "lychee:dripstone_dripping",
        source_block: fluid,
        target_block: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}

/**
 * 
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.20/general-types/#blockpredicate
 * @param {[function]} postActions [post.drop_item(item, count, chance),...] 
 * @param {function} contextual condition (optional)
 */
lychee.random_block_ticking = function(block, postActions, contextual){
    let eventData = {
        type: "lychee:random_block_ticking",
        target_block: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(contextual != undefined && contextual != false ) eventData.contextual = contextual
    return eventData
}