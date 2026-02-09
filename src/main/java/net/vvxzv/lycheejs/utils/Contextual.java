package net.vvxzv.lycheejs.utils;

import com.google.gson.*;
import dev.latvian.mods.kubejs.recipe.RecipeExceptionJS;
import dev.latvian.mods.kubejs.typings.Info;
import dev.latvian.mods.rhino.mod.util.JsonSerializable;
import dev.latvian.mods.rhino.util.HideFromJS;
import dev.latvian.mods.rhino.util.RemapForJS;
import net.minecraft.world.Difficulty;

import java.util.*;

@SuppressWarnings("unused")
public class Contextual implements JsonSerializable {
    public JsonObject json;

    private Contextual() {
        this.json = new JsonObject();
    }

    private Contextual(String type) {
        this();
        this.json.addProperty("type", type);
    }

    private Contextual(JsonObject json) {
        if (json == null) {
            throw new RecipeExceptionJS("Contextual JsonObject cannot be null!");
        }
        this.json = new JsonObject();
        for (String key : json.keySet()) {
            this.json.add(key, json.get(key).deepCopy());
        }
    }

    @Info("Create a new Contextual Object")
    public static Contextual create(){
        return new Contextual();
    }

    public static Contextual createNull() {
        return new Contextual("null");
    }

    public static Contextual create(JsonObject json) {
        return new Contextual(json);
    }

    public Contextual setType(String type){
        this.json.addProperty("type", type);
        return this;
    }

    public Contextual addProperty(String key, JsonElement element){
        this.json.add(key, element);
        return this;
    }

    private static Contextual buildLogicalContext(String type, Contextual... contextuals) {
        if (contextuals == null || contextuals.length == 0) {
            throw new RecipeExceptionJS(type + " Contextual array cannot be null or empty!");
        }

        Contextual ctx = new Contextual(type);
        JsonArray array = new JsonArray();
        for (Contextual c : contextuals) {
            if (c == null || c.json.size() == 0) {
                throw new RecipeExceptionJS(type + " Contextual array contains empty element!");
            }
            array.add(c.toJsonJS());
        }
        ctx.json.add("contextual", array);
        return ctx;
    }

    @Info("int offsetX, int offsetY, int offsetZ")
    public Contextual offset(int offsetX, int offsetY, int offsetZ){
        this.json.addProperty("offsetX", offsetX);
        this.json.addProperty("offsetY", offsetY);
        this.json.addProperty("offsetZ", offsetZ);
        return this;
    }

    public Contextual offsetX(int offsetX){
        this.json.addProperty("offsetX", offsetX);
        return this;
    }

    public Contextual offsetY(int offsetY){
        this.json.addProperty("offsetY", offsetY);
        return this;
    }

    public Contextual offsetZ(int offsetZ){
        this.json.addProperty("offsetZ", offsetZ);
        return this;
    }

    @Info("Contextual contextual")
    public static Contextual not(Contextual contextual) {
        if (contextual == null || contextual.json.size() == 0) {
            throw new RecipeExceptionJS("Cannot create 'not' Contextual with empty input!");
        }

        Contextual ctx = new Contextual("not");
        ctx.json.add("contextual", contextual.toJsonJS());
        return ctx;
    }

    @Info("Contextual... contextual")
    public static Contextual or(Contextual... ctx) {
        return buildLogicalContext("or", ctx);
    }

    @Info("Contextual... contextual")
    public static Contextual and(Contextual... ctx) {
        return buildLogicalContext("and", ctx);
    }

    @Info("double number")
    public static Contextual chance(double number) {
        if (number < 0.0 || number > 1.0) {
            throw new RecipeExceptionJS("Chance value must be between 0.0 and 1.0, got: " + number);
        }

        Contextual ctx = new Contextual("chance");
        ctx.json.addProperty("chance", number);
        return ctx;
    }

    @Info("LocationPredicate_ predicate")
    public static Contextual location(Object predicate) {
        Contextual ctx = new Contextual("location");
        if(predicate instanceof LocationPredicate locationPredicate){
            ctx.json.add("predicate", locationPredicate.toJsonJS());
        }
        else if(predicate instanceof JsonObject object){
            ctx.json.add("predicate", object);
        }
        else throw new RecipeExceptionJS("Predicate cannot be null for location Contextual!");
        return ctx;
    }

    @Info("\"clear\" | \"rain\" | \"thunder\"")
    public static Contextual weather(String w) {
        if (w == null || w.isBlank()) {
            throw new RecipeExceptionJS("Weather type cannot be null or empty!");
        }

        String lowerW = w.toLowerCase();
        if (!Arrays.asList("clear", "rain", "thunder").contains(lowerW)) {
            throw new RecipeExceptionJS("Invalid weather type: '" + w + "'! Valid types: clear, rain, thunder");
        }

        Contextual ctx = new Contextual("weather");
        ctx.json.addProperty("weather", lowerW);
        return ctx;
    }

    @Info("\"easy\" | \"1\" ...")
    public static Contextual difficulty(Object... values) {
        if (values == null || values.length == 0) {
            throw new RecipeExceptionJS("Difficulty values cannot be null or empty!");
        }

        Contextual ctx = new Contextual("difficulty");
        JsonArray difficultyArray = new JsonArray();

        for (Object val : values) {
            if (val == null) {
                throw new RecipeExceptionJS("Difficulty value cannot be null!");
            }

            if (val instanceof String str) {
                String integerRegex = "^[-+]?\\d+$";
                if(str.matches(integerRegex)){
                    try {
                        int num = Integer.parseInt(str);
                        if (num < 0 || num > 3) {
                            throw new RecipeExceptionJS("Difficulty ID must be 0-3, got: " + num);
                        }
                        difficultyArray.add(num);
                    } catch (NumberFormatException ignored) {
                    }
                }
                else {
                    Difficulty diff = Difficulty.byName(str.toLowerCase());
                    if (diff == null) {
                        throw new RecipeExceptionJS("Invalid difficulty string: '" + str + "'! Valid types: peaceful, easy, normal, hard");
                    }
                    difficultyArray.add(diff.getSerializedName());
                }
            } else if (val instanceof Difficulty diff) {
                difficultyArray.add(diff.getSerializedName());
            } else {
                throw new RecipeExceptionJS("Unsupported difficulty type: " + val.getClass().getName() + " (supported: String/Integer/Difficulty)");
            }
        }

        ctx.json.add("difficulty", difficultyArray);
        return ctx;
    }

    @Info("int min, int max")
    public static Contextual time(int min, int max) {
        Contextual ctx = new Contextual("time");
        IntBounds intBounds = IntBounds.of(min, max);
        ctx.json.add("value", intBounds.toJson());
        return ctx;
    }

    @Info("int time")
    public static Contextual time(int t) {
        return time(t, t);
    }

    @Info("int minTime, int maxTime, int period")
    public static Contextual time(int minTime, int maxTime, int period) {
        Contextual ctx = time(minTime, maxTime);
        ctx.json.addProperty("period", period);
        return ctx;
    }

    @Info("String command")
    public static Contextual execute(String command) {
        Contextual ctx = new Contextual("execute");
        ctx.json.addProperty("command", command);
        return ctx;
    }

    @Info("String command, int minValue, int maxValue")
    public static Contextual execute(String command, int min, int max) {
        Contextual ctx = execute(command);
        IntBounds intBounds = IntBounds.of(min, max);
        ctx.json.add("value", intBounds.toJson());
        return ctx;
    }

    @Info("String command, int value")
    public static Contextual execute(String command, int value) {
        return execute(command, value, value);
    }

    @RemapForJS("fall_distance")
    public static Contextual fallDistance(double min, double max){
        Contextual ctx = new Contextual("fall_distance");
        DoubleBounds doubleBounds = DoubleBounds.of(min, max);
        ctx.json.add("range", doubleBounds.getJson());
        return ctx;
    }

    @RemapForJS("fall_distance")
    public static Contextual fallDistance(double range){
        return fallDistance(range, range);
    }

    @RemapForJS("entity_health")
    public static Contextual entityHealth(double range){
        return entityHealth(range, range);
    }

    @RemapForJS("entity_health")
    public static Contextual entityHealth(double min, double max){
        Contextual ctx = new Contextual("entity_health");
        DoubleBounds doubleBounds = DoubleBounds.of(min, max);
        ctx.json.add("range", doubleBounds.getJson());
        return ctx;
    }

    @RemapForJS("is_sneaking")
    public static Contextual isSneaking() {
        return new Contextual("is_sneaking");
    }

    @Info("\"up\", \"down\", \"north\", \"south\", \"east\", \"west\", \"side\", \"forward\"")
    public static Contextual direction(String d) {
        Contextual ctx = new Contextual("direction");
        ctx.json.addProperty("direction", d);
        return ctx;
    }

    @RemapForJS("check_param")
    public static Contextual checkParam(String key) {
        Contextual ctx = new Contextual("check_param");
        ctx.json.addProperty("key", key);
        return ctx;
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
        Contextual that = (Contextual) o;
        return Objects.equals(json, that.json);
    }

    @Override
    public int hashCode() {
        return Objects.hash(json);
    }

    @HideFromJS
    public static Contextual fromJson(JsonObject jsonObj) {
        return new Contextual(jsonObj);
    }
}