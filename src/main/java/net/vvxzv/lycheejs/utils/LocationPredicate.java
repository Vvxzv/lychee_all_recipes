package net.vvxzv.lycheejs.utils;

import com.google.gson.*;
import dev.latvian.mods.kubejs.recipe.RecipeExceptionJS;
import dev.latvian.mods.kubejs.typings.Info;
import dev.latvian.mods.rhino.mod.util.JsonSerializable;
import dev.latvian.mods.rhino.util.HideFromJS;
import dev.latvian.mods.rhino.util.RemapForJS;
import net.minecraft.resources.ResourceLocation;

import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;

@SuppressWarnings("unused")
public class LocationPredicate implements JsonSerializable {
    public JsonObject json;

    private LocationPredicate(){
        this.json = new JsonObject();
    }

    private LocationPredicate(JsonObject object){
        if (object == null) {
            throw new RecipeExceptionJS("LocationPredicate JsonObject cannot be null!");
        }
        this.json = new JsonObject();
        for (String key : object.keySet()) {
            this.json.add(key, object.get(key).deepCopy());
        }
    }

    public static LocationPredicate create(JsonObject object){
        return new LocationPredicate(object);
    }

    public static LocationPredicate of(){
        return new LocationPredicate();
    }

    public LocationPredicate biome(ResourceLocation id) {
        this.json.addProperty("biome", id.toString());
        return this;
    }

    @Info("BlockPredicate_ blockPredicate")
    public LocationPredicate block(Object blockPredicate) {
        if(blockPredicate instanceof String s){
            JsonObject object = new JsonObject();
            JsonArray array = new JsonArray();
            array.add(s);
            object.add("blocks", array);
            this.json.add("block", object);
        }
        else if(blockPredicate instanceof List<?> list && !list.isEmpty() && list.get(0) instanceof String){
            JsonObject object = new JsonObject();
            JsonArray array = new JsonArray();
            list.forEach(s -> array.add(new JsonPrimitive((String) s)));
            object.add("blocks", array);
            this.json.add("block", object);
        }
        else if (blockPredicate instanceof BlockPredicate predicate){
            this.json.add("block", predicate.json);
        }
        else if (blockPredicate instanceof JsonObject jsonObject) {
            this.json.add("block", jsonObject);
        }
        else if (blockPredicate instanceof JsonElement element) {
            this.json.add("block", element);
        }
        return this;
    }


    public LocationPredicate dimension(ResourceLocation id){
        this.json.addProperty("dimension", id.toString());
        return this;
    }

    @Info("JsonObject_ fluidPredicate")
    public LocationPredicate fluid(Object fluidPredicate){
        if(fluidPredicate instanceof String string){
            JsonObject object = new JsonObject();
            object.addProperty("fluid", string);
            this.json.add("fluid", object);
        }
        else if (fluidPredicate instanceof JsonObject jsonObject) {
            this.json.add("fluid", jsonObject);
        }
        else if (fluidPredicate instanceof JsonElement element) {
            this.json.add("fluid", element);
        }
        return this;
    }

    @Info("int light_level")
    public LocationPredicate light(int l){
        this.json.addProperty("light", l);
        return this;
    }

    @Info("int minLight, int maxLight")
    public LocationPredicate light(int min, int max){
        IntBounds intBounds = IntBounds.of(min, max);
        this.json.add("light", intBounds.toJson());
        return this;
    }

    @Info("Consumer<PositionBuilder> consumer")
    public LocationPredicate position(Consumer<PositionBuilder> consumer) {
        PositionBuilder builder = new PositionBuilder();
        consumer.accept(builder);
        this.json.add("position", builder.build());
        return this;
    }

    public LocationPredicate smokey(boolean s){
        this.json.addProperty("smokey", s);
        return this;
    }

    public LocationPredicate structure(ResourceLocation id){
        this.json.addProperty("structure", id.toString());
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
        LocationPredicate that = (LocationPredicate) o;
        return Objects.equals(json, that.json);
    }

    @Override
    public int hashCode() {
        return Objects.hash(json);
    }

    public static class PositionBuilder {
        private Double x;
        private Double minX, maxX;
        private Double y;
        private Double minY, maxY;
        private Double z;
        private Double minZ, maxZ;

        public PositionBuilder x(double value) {
            this.x = value;
            return this; // 链式调用
        }

        public PositionBuilder minX(double value) {
            this.minX = value;
            return this;
        }

        public PositionBuilder maxX(double value) {
            this.maxX = value;
            return this;
        }

        public PositionBuilder y(double value) {
            this.y = value;
            return this;
        }

        public PositionBuilder minY(double value) {
            this.minY = value;
            return this;
        }

        public PositionBuilder maxY(double value) {
            this.maxY = value;
            return this;
        }

        public PositionBuilder z(double value) {
            this.z = value;
            return this;
        }

        public PositionBuilder minZ(double value) {
            this.minZ = value;
            return this;
        }

        public PositionBuilder maxZ(double value) {
            this.maxZ = value;
            return this;
        }

        @HideFromJS
        public JsonObject build() {
            JsonObject positionJson = new JsonObject();

            addAxisConfig(positionJson, "x", x, minX, maxX);
            addAxisConfig(positionJson, "y", y, minY, maxY);
            addAxisConfig(positionJson, "z", z, minZ, maxZ);

            return positionJson;
        }

        private void addAxisConfig(JsonObject parentJson, String axisName, Double fixedValue, Double minValue, Double maxValue) {
            if (fixedValue != null) {
                parentJson.addProperty(axisName, fixedValue);
            } else {
                JsonObject axisRange = new JsonObject();
                if (minValue != null) {
                    axisRange.addProperty("min", minValue);
                }
                if (maxValue != null) {
                    axisRange.addProperty("max", maxValue);
                }
                if (axisRange.size() > 0) {
                    parentJson.add(axisName, axisRange);
                }
            }
        }
    }
}
