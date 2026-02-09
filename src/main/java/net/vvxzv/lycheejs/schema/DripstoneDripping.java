package net.vvxzv.lycheejs.schema;

import dev.latvian.mods.kubejs.recipe.RecipeKey;
import dev.latvian.mods.kubejs.recipe.schema.RecipeSchema;

public interface DripstoneDripping extends BaseRecipeSchema {
    RecipeKey<Object> SOURCE = LycheeSchema.BLOCK_PREDICATE.key("source_block");
    RecipeKey<Object> TARGET = LycheeSchema.BLOCK_PREDICATE.key("target_block");
    RecipeSchema SCHEMA = new RecipeSchema(SOURCE, TARGET, POST_ACTION, CONTEXTUAL_CONDITION, COMMENT, GHOST, HIDE_IN_VIEWER);
}
