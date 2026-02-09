package net.vvxzv.lycheejs.utils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class DoubleBounds {
    private JsonObject json;

    private DoubleBounds(double min, double max){
        JsonObject object = new JsonObject();
        object.addProperty("min", min);
        object.addProperty("max", max);
        this.json = object;
    }

    public static DoubleBounds of(double min, double max) {
        return new DoubleBounds(min, max);
    }

    public static DoubleBounds of(double value) {
        return DoubleBounds.of(value, value);
    }

    public static DoubleBounds of(JsonElement element){
        return DoubleBounds.of(element.getAsJsonObject());
    }

    public static DoubleBounds of(JsonObject object){
        double min = object.get("min").getAsDouble();
        double max = object.get("max").getAsDouble();
        if(object.getAsJsonPrimitive().isNumber()){
            min = object.getAsDouble();
            max = object.getAsDouble();
        }
        return new DoubleBounds(min, max);
    }

    public JsonObject getJson(){
        return this.json;
    }

    public double getMin() {
        return json.get("min").getAsDouble();
    }

    public double getMax() {
        return json.get("max").getAsDouble();
    }

    public static boolean isDoubleBounds(JsonElement element) {
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
