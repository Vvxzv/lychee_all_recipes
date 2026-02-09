package net.vvxzv.lycheejs.schema;

import dev.latvian.mods.kubejs.item.InputItem;
import dev.latvian.mods.kubejs.recipe.RecipeKey;
import dev.latvian.mods.kubejs.recipe.component.ItemComponents;
import dev.latvian.mods.kubejs.recipe.schema.RecipeSchema;

public interface ItemExploding extends BaseRecipeSchema {
    RecipeKey<InputItem[]> ITEM_IN = ItemComponents.INPUT_ARRAY.key("item_in");
    RecipeSchema SCHEMA = new RecipeSchema(ITEM_IN, POST_ACTION, CONTEXTUAL_CONDITION, COMMENT, GHOST, HIDE_IN_VIEWER);
}
