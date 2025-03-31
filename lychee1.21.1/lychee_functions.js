//Edited by Vvxzv
//lychee for minecraft ver 1.21.1 neoforge

//这里是编写函数的地方
//函数使用例子在另一个文件
//写配方的文件要放在和这个函数文件同一个文件夹下(可能)

var lychee = {}
// ifc就是原来的contextual，
// 由于它在配方里变成了使用if而不是contextual因此这里改成ifc
var ifc = {}

var post = {}

//检测字符串第一个字符是否为数字
function isFirstCharDigit(str) {
    return !isNaN(str.charAt(0)) && str.charAt(0) !== ' ';
}

function extractQuantity(str) {
    // 使用正则表达式匹配字符串中的数字
    const match = str.match(/^(\d+)\s*x/);
    
    // 如果匹配到数字，返回数字，否则返回 null
    return match ? parseInt(match[1], 10) : null;
}

//更换 item 类型
/**
 * 
 * @param {SizedIngredient} item https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
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
        else if (typeof item === 'string' && isFirstCharDigit(item)) {
            let count = extractQuantity(item)
            item = item.split(' ')[1]
            return { item: item, count: count }
        }
        else if (typeof item === 'string') {
            return { item: item }
        }
    })
    return output
}

/**
 * 
 * @param {SizedIngredient} item https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @returns 
 */
function item_or_tag(item){
    if (typeof item === 'object' && !Array.isArray(item)) {
        return item
    } 
    else if (typeof item === 'string' && item.startsWith("#")) {
        return { tag: item.slice(1) }
    }
    else if (typeof item === 'string') {
        return { item: item }
    }
}

/**
 * 
 * @param {number} chance 
 * @returns 
 */
ifc.chance = (chance) => ({
    type: "chance", 
    chance: chance 
})

/**
 * 
 * @param {property} ifc condition
 * @returns 
 */
ifc.not = (ifc) => ({
    type: "not", 
    contextual:ifc
})

/**
 * 
 * @param {property} ifc condition 
 * @returns 
 */
ifc.or = (ifc) => ({
    type: "or", 
    contextual:Array.isArray(ifc)?ifc:[ifc]
})

/**
 * @param {[property]} ifc condition
 * @returns
 */
ifc.and = (ifc) => ({
    type: "and", 
    contextual:Array.isArray(ifc)?ifc:[ifc]
})

/**
 * 
 * @param {JSON} predicate https://minecraft.wiki/w/Advancement/Conditions/location?direction=next&oldid=2544408
 * @param {[int,int,int]} offset [offsetX, offsetY, offsetZ]
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.21/contextual-condition/#location-check
 */
ifc.location = function(predicate, offset){
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
ifc.weather = (weather) => ({
    type: "weather",
    weather:weather
})

/**
 * 
 * @param {string} difficulty string | int | string[] | int[]
 * @returns 
 */
ifc.difficulty = (difficulty) => ({
    type: "difficulty",
    difficulty:difficulty
})

/**
 * 
 * @param {string} item 
 * @returns 
 */
ifc.is_off_item_cooldown = (item) => ({
    type: "is_off_item_cooldown",
    item: item
})

/**
 * 
 * @param {int} time int | [ int(min), int(max) ]
 * @param {int} period 
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.21/contextual-condition/#time-check
 */
ifc.time = (time, period) => ({
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
ifc.execute = (command, value) => ({
    type: "execute",
    command:command,
    value:Array.isArray(value) ? {min:value[0],max:value[1]} : value
})

/**
 * 
 * @param {DoubleBounds} fall_distance_range number | [number(min), number(max)]
 * @returns 
 */
ifc.fall_distance = (fall_distance_range) => ({
    type: "fall_distance",
    range:Array.isArray(fall_distance_range) ? {min:fall_distance_range[0],max:fall_distance_range[1]} : fall_distance_range
})

/**
 * 
 * @param {DoubleBounds} entity_health_range number | [number(min), number(max)]
 * @param {property} ifc optional
 * @returns 
 */
ifc.entity_health = (entity_health_range) => ({
    type: "entity_health",
    range:Array.isArray(entity_health_range) ? {min:entity_health_range[0],max:entity_health_range[1]} : entity_health_range
})

ifc.is_sneaking = () => ({
    type: "is_sneaking"
})

/**
 * 
 * @param {"up" | "down" | "north" | "south" | "east" | "west" | "side" | "forward"} direction
 * @returns 
 */
ifc.direction = (direction) => ({
    type: "direction",
    direction:direction
})

/**
 * 
 * @param {string} key loot parameter name
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.21/contextual-condition/#loot-parameter-check
 */
ifc.check_param = (key) => ({
    type: "check_param",
    key:key
})

/**
 * 
 * @param {IntBounds} value 
 * @param {boolean} require_sky_light 
 * @param {boolean} can_see_sky 
 */
ifc.sky_darken = function(value, require_sky_light, can_see_sky){
    let data = {
        type: "sky_darken",
        value: Array.isArray(value) ? {min:value[0],max:value[1]} : value,
    }
    if(require_sky_light != undefined && require_sky_light != false ) data.require_sky_light = require_sky_light
    if(can_see_sky != undefined && can_see_sky != false ) data.can_see_sky = can_see_sky
    return data
}

/**
 * 
 * @param {string} item 
 * @param {int} count default 1
 * @param {property} ifc optional
 * @param {dictionary} components optional
 * @returns 
 */
post.dropItem = function(id, count, ifc, components){
    let data = {
        type: "drop_item",
        id: id
    }
    data.weight = function(weightValue) {
        if (weightValue != undefined && weightValue !== false){
            data.weight = weightValue
        }
        return data
    }
    if(count != undefined && count != false ) data.count = count
    if(ifc != undefined && ifc != false ) data.if = ifc
    if(components != undefined && components != false ) data.components = components
    return data
}

/**
 * 
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {[int,int,int]} offset [offsetX, offsetY, offsetZ] optional
 * @param {property} ifc optional
 * @returns 
 */
post.placeBlock = function(block, offset, ifc){
    let data = {
        type: "place",
        block: block
    }
    if(offset != undefined && offset != false ){
        data.offsetX = offset[0]
        data.offsetY = offset[1]
        data.offsetZ = offset[2]
    }
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

/**
 * 
 * @param {int} count 
 * @param {property} ifc optional
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.21/post-action/#damage-item
 */
post.damage_item = function(count, ifc){
    let data = {
        type: "damage_item"
    }
    if(count != undefined && count != false ) data.damage = count
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

/**
 * 
 * @param {string} command 
 * @param {boolean} hide default false
 * @param {boolean} repeat default true
 * @param {property} ifc optional
 * @returns 
 */
post.execute = function(command, hide, repeat, ifc){
    let data = {
        type: "execute",
        command:command
    }
    if(hide != undefined && hide != false ) data.hide = hide
    if(repeat != undefined && repeat != false ) data.repeat = repeat
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

/**
 * 
 * @param {int} xp 
 * @param {property} ifc optional
 * @returns 
 */
post.drop_xp = function(xp, ifc){
    let data = {
        type: "drop_xp",
        xp:xp
    }
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

/**
 * 
 * @param {IntBounds} rolls [0,2] => [min, max]
 * @param {[]} entries Weighted postAction[]
 * @param {property} ifc optional
 * @returns 
 */
post.random = function(rolls, entries, ifc){
    let data = {
        type: "random",
        rolls:Array.isArray(rolls)?{min: rolls[0],max: rolls[1]}:rolls,
        entries:Array.isArray(entries)?entries:[entries]
    }
    if(ifc != undefined && ifc != false ) data.if = ifc
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
 * @param {property} ifc optional
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.21/post-action/#create-explosion
 */
post.explode = function(offset, fire, block_interaction, radius, radius_step, ifc){
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
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

/**
 * 
 * @param {number} chance 0.0-1.0
 * @param {property} ifc optional
 * @returns 
 */
post.anvil_damage_chance = function(chance, ifc){
    let data = {
        type:"anvil_damage_chance",
        chance:chance
    }
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

/**
 * 
 * @param {number} seconds 
 * @param {property} ifc optional
 * @returns 
 */
post.add_item_cooldown = function(seconds, ifc){
    let data = {
        type:"add_item_cooldown",
        s:seconds
    }
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

/**
 * 
 * @param {number} factor default 1
 * @param {property} ifc optional
 * @returns 
 */
    
post.move_towards_face = function(factor, ifc){
    let data = {
        type:"move_towards_face"
    }
    if(factor != undefined && factor != false ) data.factor = factor
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

/**
 * 
 * @param {number} seconds 
 * @param {property} ifc optional
 * @returns 
 */
post.delay = function(seconds, ifc){
    let data = {
        type:"delay",
        s:seconds
    }
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

post.exit = () => ({
    type:"exit"
})

/**
 * 
 * @param {BlockPredicate} block 
 * @param {string} property 
 * @param {[int,int,int]} offset [offsetX, offsetY, offsetZ] optional
 * @param {property} ifc optional
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.21/post-action/#cycle-state-property
 */
post.cycle_state_property = function(block, property, offset, ifc){
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
    if(ifc != undefined && ifc != false ) data.if = ifc
    return data
}

post.prevent_default = () => ({
    type: "prevent_default"
})

/**
 * 
 * @param {string} item 
 * @param {int} count default 1
 * @param {property} ifc optional
 * @param {dictionary} components optional
 * @returns https://lycheetweaker.readthedocs.io/en/docs-1.21/post-action/#set-item
 */
post.setItem = function(item, count, ifc, components){
    let data = {
        type:"set_item",
        item:item
    }
    if(count != undefined && count != false ) data.count = count
    if(ifc != undefined && ifc != false ) data.if = ifc
    if(components != undefined && components != false ) data.components = components
    return data
}

//lychee function
/**
 * 
 * @param {[string]} item   custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {[property]} postActions [post.drop_item(item, count, chance),...]
 * @param {property} ifc condition (optional)
 */
lychee.use_item_on_block = function(item, block, postActions, ifc){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_interacting",
        item_in: itemin,
        block_in: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {[property]} postActions [post.drop_item(item, count, chance),...]
 * @param {property} ifc condition (optional)
 */
lychee.click_block_with_item = function(item, block, postActions, ifc){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_clicking",
        item_in: itemin,
        block_in: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {string} item   custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {[property]} postActions [post.drop_item(item, count, chance),...]
 * @param {property} ifc condition (optional)
 */
lychee.item_burning = function(item, postActions, ifc){
    let itemin = item_or_tag(item)
    let eventData = {
        type: "lychee:item_burning",
        item_in: itemin,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 *
 * @param {[string]} item    custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {[property]} postActions [post.drop_item(item, count, chance),...]
 * @param {property} ifc condition (optional)
 */
lychee.item_inside = function(item, block, postActions, time, ifc){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:item_inside",
        item_in:itemin,
        block_in: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(time != undefined && time != false ) eventData.time = time
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {string} item Item Id 'minecraft:apple'
 * @param {string} material 'minecraft:apple' or '3x minecraft:apple'
 * @param {string} result 
 * @param {int} level_cost 
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {property} ifc condition (optional)
 */
lychee.anvil_crafting = function(item, material, result, level_cost, postActions, ifc){
    let material_cost = 1
    if(isFirstCharDigit(material)){
        material_cost = extractQuantity(material)
        material = material.split(' ')[1]
    }
    let itemin = [item, material]
    let eventData = {
        type: "lychee:anvil_crafting",
        item_in: item_type(itemin),
        item_out: { id: result },
        level_cost: level_cost,
        material_cost: material_cost,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {[property]} postActions [post.drop_item(item, count, chance),...]
 * @param {property} ifc condition (optional)
 */
lychee.anvil_crushing = function(item, postActions, ifc){
    let item_in = item_type(item)
    let eventData = {
        type: "lychee:block_crushing",
        item_in: item_in,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {BlockPredicate} falling_block 
 * https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {property} ifc condition (optional)
 */
lychee.falling_block_crushing = function(item, postActions, falling_block, ifc){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_crushing",
        item_in:itemin,
        post: Array.isArray(postActions) ? postActions : [postActions],
        falling_block:falling_block
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {BlockPredicate} landing_block 
 * https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {property} ifc condition (optional)
 */
lychee.anvil_crushing_on_landing_block = function(item, postActions, landing_block, ifc){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_crushing",
        item_in:itemin,
        post: Array.isArray(postActions) ? postActions : [postActions],
        landing_block:landing_block
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {BlockPredicate} landing_block 
 * https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {BlockPredicate} falling_block 
 * https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {property} ifc condition (optional)
 */
lychee.falling_block_crushing_on_landing_block = function(item, postActions, falling_block, landing_block, ifc){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:block_crushing",
        item_in:itemin,
        post: Array.isArray(postActions) ? postActions : [postActions],
        landing_block:landing_block,
        falling_block:falling_block
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}


/**
 * 
 * @param {[string]} item   custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {property} ifc condition (optional)
 */
lychee.lightning_channeling_item = function(item, postActions, ifc){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:lightning_channeling",
        item_in: itemin,
        post:  Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {property} ifc condition (optional)
 */
lychee.lightning_channeling = function(postActions, ifc){
    let eventData = {
        type: "lychee:lightning_channeling",
        post:  Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {[string]} item   custom item ingredient: https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#sizedingredient
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {property} ifc condition (optional)
 */
lychee.item_exploding = function(item, postActions, ifc){
    let itemin = item_type(item)
    let eventData = {
        type: "lychee:item_exploding",
        item_in:itemin,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {property} ifc condition (optional)
 */
lychee.block_exploding = function(block, postActions, ifc){
    let eventData = {
        type: "lychee:block_exploding",
        block_in:block,
        post:  Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {BlockPredicate} fluid https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {property} ifc condition (optional)
 */
lychee.dripstone_dripping = function(fluid, block, postActions, ifc){
    let eventData = {
        type: "lychee:dripstone_dripping",
        source_block: fluid,
        target_block: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}

/**
 * 
 * @param {BlockPredicate} block https://lycheetweaker.readthedocs.io/en/docs-1.21/general-types/#blockpredicate
 * @param {[property]} postActions [post.drop_item(item, count, chance),...] 
 * @param {property} ifc condition (optional)
 */
lychee.random_block_ticking = function(block, postActions, ifc){
    let eventData = {
        type: "lychee:random_block_ticking",
        target_block: block,
        post: Array.isArray(postActions) ? postActions : [postActions]
    }
    if(ifc != undefined && ifc != false ) eventData.if = ifc
    return eventData
}