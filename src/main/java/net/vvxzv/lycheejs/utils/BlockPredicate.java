package net.vvxzv.lycheejs.utils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import dev.latvian.mods.kubejs.recipe.RecipeExceptionJS;
import dev.latvian.mods.kubejs.typings.Info;
import dev.latvian.mods.rhino.mod.util.JsonSerializable;
import dev.latvian.mods.rhino.util.HideFromJS;
import dev.latvian.mods.rhino.util.RemapForJS;

import java.util.Objects;

@SuppressWarnings("unused")
public class BlockPredicate implements JsonSerializable {
    public JsonObject json;

    private BlockPredicate(){
        this.json = new JsonObject();
    }

    private BlockPredicate(JsonObject object){
        this();
        if (object == null) {
            throw new RecipeExceptionJS("BlockPredicate JsonObject cannot be null!");
        }
        for (String key : object.keySet()) {
            this.json.add(key, object.get(key).deepCopy());
        }
    }

    public static BlockPredicate create(JsonObject json){
        return new BlockPredicate(json);
    }

    @Info("String... block_id_or_tag")
    public static BlockPredicate of(String... values){
        BlockPredicate blockPredicate = new BlockPredicate();
        JsonArray array = new JsonArray();
        for (String value : values){
            if(value.contains("#")){
                value = value.substring(1);
                blockPredicate.json.addProperty("tag", value);
            }
            else array.add(value);
        }
        blockPredicate.json.add("blocks", array);
        return blockPredicate;
    }

    public BlockPredicate withNBT(String nbt){
        this.json.addProperty("nbt", nbt);
        return this;
    }

    @Info("String key, String value")
    public BlockPredicate withState(String key, String value) {
        JsonObject stateJsonObject = new JsonObject();
        String integerRegex = "^[-+]?\\d+$";

        if (value != null && value.matches(integerRegex)) {
            try {
                Integer numValue = Integer.parseInt(value);
                stateJsonObject.addProperty(key, numValue);
            } catch (NumberFormatException e) {
                stateJsonObject.addProperty(key, value);
            }
        } else {
            stateJsonObject.addProperty(key, value);
        }
        this.json.add("state", stateJsonObject);
        return this;
    }

    @Info("String key, String minValue, String maxValue")
    public BlockPredicate withState(String key, String min, String max) {
        JsonObject stateJsonObject = new JsonObject();
        String integerRegex = "^[-+]?\\d+$";

        if(min != null && max != null && min.matches(integerRegex) && max.matches(integerRegex)){
            try {
                int minValue = Integer.parseInt(min);
                int maxValue = Integer.parseInt(max);
                IntBounds intBounds = IntBounds.of(minValue, maxValue);
                stateJsonObject.add(key, intBounds.toJson());
            } catch (NumberFormatException ignored) {
            }
        }
        this.json.add("state", stateJsonObject);
        return this;
    }

    @Info("String key, boolean value")
    public BlockPredicate withState(String key, boolean value){
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty(key, value);
        this.json.add("state", jsonObject);
        return this;
    }

    @Override
    @RemapForJS("toJson")
    public JsonElement toJsonJS() {
        return json.size() == 0 ? JsonNull.INSTANCE : json;
    }

    @Override
    public String toString() {
        return json.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BlockPredicate that = (BlockPredicate) o;
        return Objects.equals(json, that.json);
    }

    @Override
    public int hashCode() {
        return Objects.hash(json);
    }

    @HideFromJS
    public static BlockPredicate fromJson(JsonObject jsonObj) {
        return new BlockPredicate(jsonObj);
    }
}
