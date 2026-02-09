package net.vvxzv.lycheejs.schema;

import dev.latvian.mods.kubejs.recipe.RecipeKey;
import dev.latvian.mods.kubejs.recipe.component.BooleanComponent;
import dev.latvian.mods.kubejs.recipe.component.StringComponent;
import net.vvxzv.lycheejs.utils.Contextual;
import net.vvxzv.lycheejs.utils.Post;

public interface BaseRecipeSchema {
    RecipeKey<Post[]> POST_ACTION = LycheeSchema.POST_ARRAY.key("post").optional(new Post[]{Post.createNull()});
    RecipeKey<Contextual[]> CONTEXTUAL_CONDITION = LycheeSchema.CONTEXTUAL_ARRAY.key("contextual").optional(new Contextual[]{Contextual.createNull()});
    RecipeKey<String> COMMENT = StringComponent.ANY.key("comment").optional("");
    RecipeKey<Boolean> GHOST = BooleanComponent.BOOLEAN.key("glost").optional(false);
    RecipeKey<Boolean> HIDE_IN_VIEWER = BooleanComponent.BOOLEAN.key("hide_in_viewer").optional(false);
}
