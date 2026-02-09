package net.vvxzv.lycheejs.schema;

import dev.latvian.mods.kubejs.recipe.RecipeKey;
import dev.latvian.mods.kubejs.recipe.schema.RecipeSchema;

public interface RandomBlockTicking extends BaseRecipeSchema {
    RecipeKey<Object> BLOCK_IN = LycheeSchema.BLOCK_PREDICATE.key("block_in");
    RecipeSchema SCHEMA = new RecipeSchema(BLOCK_IN, POST_ACTION, CONTEXTUAL_CONDITION, COMMENT, GHOST, HIDE_IN_VIEWER);
}
