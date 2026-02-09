package net.vvxzv.lycheejs.schema;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import dev.latvian.mods.kubejs.recipe.RecipeJS;
import dev.latvian.mods.kubejs.recipe.component.RecipeComponent;
import dev.latvian.mods.kubejs.registry.RegistryInfo;
import dev.latvian.mods.kubejs.typings.desc.DescriptionContext;
import dev.latvian.mods.kubejs.typings.desc.PrimitiveDescJS;
import dev.latvian.mods.kubejs.typings.desc.TypeDescJS;
import net.minecraft.tags.TagKey;
import net.minecraft.world.level.block.Block;
import net.vvxzv.lycheejs.utils.BlockPredicate;
import net.vvxzv.lycheejs.utils.Contextual;
import net.vvxzv.lycheejs.utils.Post;

import java.util.List;

public interface LycheeSchema {
    RecipeComponent<Object> BLOCK_PREDICATE = new RecipeComponent<>() {
        @Override
        public Class<?> componentClass() {
            return Object.class;
        }

        @Override
        public TypeDescJS constructorDescription(DescriptionContext ctx) {
            return new PrimitiveDescJS("BlockPredicate_");
        }

        @Override
        public JsonElement write(RecipeJS recipe, Object value) {
            if (value instanceof String str) {
                return new JsonPrimitive(str);
            } else if (value instanceof List<?> list && !list.isEmpty() && list.get(0) instanceof String) {
                JsonObject object = new JsonObject();
                JsonArray array = new JsonArray();
                list.forEach(s -> array.add(new JsonPrimitive((String) s)));
                object.add("blocks", array);
                return object;
            }
            else if(value instanceof BlockPredicate blockPredicate){
                return blockPredicate.toJsonJS();
            }
            else if (value instanceof JsonObject jsonObject) {
                JsonObject json = new JsonObject();
                for (String key : jsonObject.keySet()){
                    json.add(key, jsonObject.get(key).deepCopy());
                }
                return json;
            }
            return new JsonObject();
        }

        @Override
        public Object read(RecipeJS recipe, Object from) {
            if (from instanceof String str) {
                return str;
            }
            else if (from instanceof List<?> list && !list.isEmpty() && list.get(0) instanceof String) {
                JsonObject jsonObject = new JsonObject();
                JsonArray jsonArray = new JsonArray();
                for (Object item : list) {
                    jsonArray.add(new JsonPrimitive((String) item));
                }
                jsonObject.add("blocks", jsonArray);
                return jsonObject;
            }
            else if(from instanceof BlockPredicate blockPredicate){
                return blockPredicate;
            }
            else if (from instanceof JsonObject jsonObject) {
                return BlockPredicate.fromJson(jsonObject);
            }
            else if (from instanceof Block block) {
                return RegistryInfo.BLOCK.getId(block).toString();
            }
            else if (from instanceof TagKey<?> tag) {
                return "#" + tag.location();
            }
            return new JsonObject();
        }
    };

    RecipeComponent<Post> POST = new RecipeComponent<>() {
        @Override
        public Class<Post> componentClass() {
            return Post.class;
        }

        @Override
        public JsonElement write(RecipeJS recipeJS, Post post) {
            return post.toJsonJS();
        }

        @Override
        public Post read(RecipeJS recipeJS, Object o) {
            if (o instanceof JsonObject object) {
                return Post.fromJson(object);
            } else if (o instanceof Post post) {
                return post;
            }
            return Post.createNull();
        }
    };
    RecipeComponent<Post[]> POST_ARRAY = POST.asArray();

    RecipeComponent<Contextual> CONTEXTUAL = new RecipeComponent<>() {
        @Override
        public Class<Contextual> componentClass() {
            return Contextual.class;
        }

        @Override
        public JsonElement write(RecipeJS recipeJS, Contextual contextual) {
            return contextual.toJsonJS();
        }

        @Override
        public Contextual read(RecipeJS recipeJS, Object o) {
            if(o instanceof JsonObject object){
                return Contextual.fromJson(object);
            }
            else if(o instanceof Contextual ctx){
                return ctx;
            }
            return Contextual.createNull();
        }
    };
    RecipeComponent<Contextual[]> CONTEXTUAL_ARRAY = CONTEXTUAL.asArray();
}
