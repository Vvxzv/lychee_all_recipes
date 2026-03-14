package net.vvxzv.lycheejs.utils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@SuppressWarnings("unused")
public class IntBounds{
    private JsonObject json;

    private IntBounds(int min, int max){
        JsonObject object = new JsonObject();
        object.addProperty("min", min);
        object.addProperty("max", max);
        this.json = object;
    }

    public static IntBounds of(int min, int max) {
        return new IntBounds(min, max);
    }

    public static IntBounds of(int value) {
        return IntBounds.of(value, value);
    }

    public static IntBounds of(JsonElement element){
        return IntBounds.of(element.getAsJsonObject());
    }

    public static IntBounds of(JsonObject object){
        int min = object.get("min").getAsInt();
        int max = object.get("max").getAsInt();
        if(object.getAsJsonPrimitive().isNumber()){
            min = object.getAsInt();
            max = object.getAsInt();
        }
        return new IntBounds(min, max);
    }

    public JsonObject toJson(){
        return this.json;
    }

    public int getMin() {
        return json.get("min").getAsInt();
    }

    public int getMax() {
        return json.get("max").getAsInt();
    }

    public static boolean isIntBounds(JsonElement element) {
        if (element == null || element.isJsonNull()) {
            return false;
        }

        if (element.isJsonPrimitive() && element.getAsJsonPrimitive().isNumber()) {
            return true;
        }

        if (element.isJsonObject()) {
            JsonObject obj = element.getAsJsonObject();
            return obj.has("min")
                    && obj.get("min").isJsonPrimitive()
                    && obj.get("min").getAsJsonPrimitive().isNumber()
                    && obj.has("max")
                    && obj.get("max").isJsonPrimitive()
                    && obj.get("max").getAsJsonPrimitive().isNumber();
        }

        return false;
    }
}
