package net.vvxzv.lycheejs.schema;

import dev.latvian.mods.kubejs.recipe.RecipeKey;
import dev.latvian.mods.kubejs.recipe.component.BooleanComponent;
import dev.latvian.mods.kubejs.recipe.component.StringComponent;
import dev.latvian.mods.kubejs.recipe.schema.RecipeSchema;
import dev.latvian.mods.kubejs.recipe.schema.minecraft.ShapedRecipeSchema;
import net.vvxzv.lycheejs.utils.Contextual;
import net.vvxzv.lycheejs.utils.Post;

public interface LycheeCrafting extends ShapedRecipeSchema {
    RecipeKey<Post[]> POST_ACTION = LycheeSchema.POST_ARRAY.key("post").optional(new Post[]{Post.createNull()});
    RecipeKey<Post[]> ASSEMBLING = LycheeSchema.POST_ARRAY.key("assembling").optional(new Post[]{Post.createNull()});
    RecipeKey<Contextual[]> CONTEXTUAL_CONDITION = LycheeSchema.CONTEXTUAL_ARRAY.key("contextual").optional(new Contextual[]{Contextual.createNull()});
    RecipeKey<String> COMMENT = StringComponent.ANY.key("comment").optional("");
    RecipeKey<Boolean> GHOST = BooleanComponent.BOOLEAN.key("glost").optional(false);
    RecipeKey<Boolean> HIDE_IN_VIEWER = BooleanComponent.BOOLEAN.key("hide_in_viewer").optional(false);
    RecipeSchema SCHEMA = ShapedRecipeSchema.SCHEMA.constructor(RESULT, PATTERN, KEY, POST_ACTION, ASSEMBLING, CONTEXTUAL_CONDITION, COMMENT, GHOST, HIDE_IN_VIEWER).constructor(RESULT, PATTERN, KEY, POST_ACTION, ASSEMBLING, CONTEXTUAL_CONDITION);
}
