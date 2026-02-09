package net.vvxzv.lycheejs.schema;

import dev.latvian.mods.kubejs.item.InputItem;
import dev.latvian.mods.kubejs.recipe.RecipeKey;
import dev.latvian.mods.kubejs.recipe.component.ItemComponents;
import dev.latvian.mods.kubejs.recipe.schema.RecipeSchema;

public interface BlockCrushing extends BaseRecipeSchema {
    RecipeKey<InputItem[]> ITEM_IN = ItemComponents.INPUT_ARRAY.key("item_in");
    RecipeKey<Object> FALLING_BLOCK = LycheeSchema.BLOCK_PREDICATE.key("falling_block").optional("*");
    RecipeKey<Object> LANDING_BLOCK = LycheeSchema.BLOCK_PREDICATE.key("landing_block").optional("*");
    RecipeSchema SCHEMA = new RecipeSchema(ITEM_IN, FALLING_BLOCK, LANDING_BLOCK, POST_ACTION, CONTEXTUAL_CONDITION, COMMENT, GHOST, HIDE_IN_VIEWER);
}
