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

    private BlockPredicate(JsonObject object) {
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

    @Info("blockId or #blockTag")
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

    @Info("String nbt")
    public BlockPredicate withNBT(String nbt){
        this.json.addProperty("nbt", nbt);
        return this;
    }

    @Info("String key, String value")
    public BlockPredicate withState(String key, String value) {
        String integerRegex = "^[-+]?\\d+$";
        JsonObject stateJsonObject = this.json.has("state")
                ? this.json.getAsJsonObject("state")
                : new JsonObject();

        if (value == null) {
            this.json.add("state", stateJsonObject);
            return this;
        }

        if (value.matches(integerRegex)) {
            try {
                Integer numValue = Integer.parseInt(value);
                stateJsonObject.addProperty(key, numValue);
            } catch (NumberFormatException ignored) {
            }
        } else {
            stateJsonObject.addProperty(key, value);
        }

        this.json.add("state", stateJsonObject);
        return this;
    }

    @Info("String key, String minValue, String maxValue")
    public BlockPredicate withState(String key, String min, String max) {
        String integerRegex = "^[-+]?\\d+$";
        JsonObject stateJsonObject = this.json.has("state")
                ? this.json.getAsJsonObject("state")
                : new JsonObject();

        if (min != null && max != null && min.matches(integerRegex) && max.matches(integerRegex)) {
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

    @Info("String key, IntBounds intBounds")
    public BlockPredicate withState(String key, IntBounds intBounds) {
        JsonObject stateJsonObject = this.json.has("state")
                ? this.json.getAsJsonObject("state")
                : new JsonObject();
        stateJsonObject.add(key, intBounds.toJson());
        this.json.add("state", stateJsonObject);
        return this;
    }

    @Info("String key, boolean value")
    public BlockPredicate withState(String key, boolean value) {
        JsonObject stateJsonObject = this.json.has("state")
                ? this.json.getAsJsonObject("state")
                : new JsonObject();

        stateJsonObject.addProperty(key, value);

        this.json.add("state", stateJsonObject);
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
