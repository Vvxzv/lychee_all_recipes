package net.vvxzv.lycheejs.schema;

import dev.latvian.mods.kubejs.item.InputItem;
import dev.latvian.mods.kubejs.item.OutputItem;
import dev.latvian.mods.kubejs.recipe.RecipeKey;
import dev.latvian.mods.kubejs.recipe.component.ItemComponents;
import dev.latvian.mods.kubejs.recipe.component.NumberComponent;
import dev.latvian.mods.kubejs.recipe.schema.RecipeSchema;
import net.vvxzv.lycheejs.utils.Post;

public interface AnvilCrafting extends BaseRecipeSchema {
    RecipeKey<InputItem[]> ITEM_IN = ItemComponents.INPUT_ARRAY.key("item_in");
    RecipeKey<OutputItem> ITEM_OUT = ItemComponents.OUTPUT.key("item_out");
    RecipeKey<Integer> MATERIAL_COST = NumberComponent.INT.key("material_cost").optional(1);
    RecipeKey<Integer> LEVEL_COST = NumberComponent.INT.key("level_cost").optional(1);
    RecipeKey<Post[]> ASSEMBLING = LycheeSchema.POST_ARRAY.key("assembling").optional(new Post[]{Post.createNull()});
    RecipeSchema SCHEMA = new RecipeSchema(ITEM_IN, ITEM_OUT, MATERIAL_COST, LEVEL_COST, POST_ACTION, ASSEMBLING, CONTEXTUAL_CONDITION, COMMENT, GHOST, HIDE_IN_VIEWER);
}
