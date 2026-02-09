package net.vvxzv.lycheejs.utils;

import com.google.gson.*;
import dev.latvian.mods.kubejs.recipe.RecipeExceptionJS;
import dev.latvian.mods.kubejs.registry.RegistryInfo;
import dev.latvian.mods.kubejs.typings.Info;
import dev.latvian.mods.rhino.mod.util.JsonSerializable;
import dev.latvian.mods.rhino.util.HideFromJS;
import dev.latvian.mods.rhino.util.RemapForJS;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.item.ItemStack;
import snownee.lychee.util.json.JsonPointer;

import javax.annotation.Nullable;
import java.util.List;
import java.util.Objects;

@SuppressWarnings("unused")
public class Post implements JsonSerializable {
    public JsonObject json;

    private Post(){
        this.json = new JsonObject();
    }

    private Post(String type){
        this();
        this.json.addProperty("type", type);
    }

    private Post(JsonObject json) {
        if (json == null) {
            throw new RecipeExceptionJS("Post JsonObject cannot be null!");
        }
        this.json = new JsonObject();
        for (String key : json.keySet()) {
            this.json.add(key, json.get(key).deepCopy());
        }
    }

    @Info("create a new Post Object")
    public static Post create(){
        return new Post();
    }

    public static Post create(JsonObject json){
        return new Post(json);
    }

    public Post addProperty(String key, JsonElement element){
        this.json.add(key, element);
        return this;
    }

    public Post setType(String type){
        this.json.addProperty("type", type);
        return this;
    }

    public Post withChance(double chance){
        this.contextual(Contextual.chance(chance));
        return this;
    }

    public Post isSneaking(){
        this.contextual(Contextual.isSneaking());
        return this;
    }

    private static JsonArray buildContext(Contextual... contextuals) {
        JsonArray array = new JsonArray();
        for (Contextual c : contextuals) {
            if (c == null) {
                throw new RecipeExceptionJS("Contextual element cannot be null!");
            }
            JsonElement ctxJson = c.toJsonJS();
            if (ctxJson == null || ctxJson.isJsonNull()) {
                continue;
            }
            array.add(ctxJson);
        }
        return array;
    }

    private static void blockPredicate(Post post, Object blockPredicate){
        if(blockPredicate instanceof String string){
            post.json.addProperty("block", string);
        }
        else if(blockPredicate instanceof List<?> list && !list.isEmpty() && list.get(0) instanceof String){
            JsonObject object = new JsonObject();
            JsonArray array = new JsonArray();
            list.forEach(s -> array.add(new JsonPrimitive((String) s)));
            object.add("blocks", array);
            post.json.add("block", object);
        }
        else if (blockPredicate instanceof BlockPredicate predicate){
            post.json.add("block", predicate.json);
        }
        else if (blockPredicate instanceof JsonObject jsonObject) {
            post.json.add("block", jsonObject);
        }
        else if (blockPredicate instanceof JsonElement element) {
            post.json.add("block", element);
        }
    }

    public Post contextual(Contextual... ctx) {
        if (ctx == null || ctx.length == 0) {
            throw new RecipeExceptionJS("Contextual array cannot be null or empty!");
        }
        JsonArray contextualArray = buildContext(ctx);
        this.json.add("contextual", contextualArray);
        return this;
    }

    public Post weight(int weight){
        this.json.addProperty("weight", weight);
        return this;
    }

    public Post offset(int offsetX, int offsetY, int offsetZ){
        this.json.addProperty("offsetX", offsetX);
        this.json.addProperty("offsetY", offsetY);
        this.json.addProperty("offsetZ", offsetZ);
        return this;
    }

    public Post offsetX(int offsetX){
        this.json.addProperty("offsetX", offsetX);
        return this;
    }

    public Post offsetY(int offsetY){
        this.json.addProperty("offsetY", offsetY);
        return this;
    }

    public Post offsetZ(int offsetZ){
        this.json.addProperty("offsetZ", offsetZ);
        return this;
    }

    @Info("String pointer")
    public Post jsonPointer(String pointer){
        this.json.addProperty("target", pointer);
        return this;
    }

    @Info("JsonPointer pointer")
    public Post jsonPointer(JsonPointer pointer){
        this.json.addProperty("target", pointer.toString());
        return this;
    }

    @RemapForJS("drop_item")
    public static Post dropItem(ItemStack item) {
        Post post = new Post("drop_item");
        ResourceLocation itemId = RegistryInfo.ITEM.getId(item.getItem());
        if (itemId == null) {
            throw new RecipeExceptionJS("Item " + item + " has no registry ID!");
        }
        post.json.addProperty("item", itemId.toString());
        post.json.addProperty("count", item.getCount());
        if (item.getTag() != null) {
            post.json.addProperty("nbt", item.getTag().toString());
        }
        return post;
    }

    @Info("BlockPredicate blockPredicate")
    public static Post place(Object blockPredicate){
        Post post = new Post("place");
        blockPredicate(post, blockPredicate);
        return post;
    }

    @Info("String command, boolean hide, boolean repeat")
    public static Post execute(String command, boolean hide, boolean repeat){
        Post post = new Post("execute");
        post.json.addProperty("command", command);
        post.json.addProperty("hide", hide);
        post.json.addProperty("repeat", repeat);
        return post;
    }

    @Info("String command, boolean hide")
    public static Post execute(String command, boolean hide){
        return execute(command, false, true);
    }

    @Info("String command")
    public static Post execute(String command){
        return execute(command, false);
    }

    @RemapForJS("drop_xp")
    @Info("int xp")
    public static Post dropXp(int xp){
        Post post = new Post("drop_xp");
        post.json.addProperty("xp", xp);
        return post;
    }

    @Info("int rollsMin, int rollsMax, Post[] entries, int empty_weight")
    public static Post random(int rollsMin, int rollsMax, Post[] entries, int empty_weight){
        Post post = new Post("random");
        IntBounds intBounds = IntBounds.of(rollsMin, rollsMax);
        post.json.add("rolls", intBounds.toJson());
        JsonArray array = new JsonArray();
        for (Post entry: entries){
            array.add(entry.json);
        }
        post.json.add("entries", array);
        post.json.addProperty("empty_weight", empty_weight);
        return post;
    }

    @Info("int rollsMin, int rollsMax, Post[] entries")
    public static Post random(int rollsMin, int rollsMax, Post[] entries){
        return random(rollsMin, rollsMax, entries, 0);
    }

    @Info("int rolls, Post[] entries, int empty_weight")
    public static Post random(int rolls, Post[] entries, int empty_weight){
        return random(rolls, rolls, entries, empty_weight);
    }

    @Info("int rolls, Post[] entries")
    public static Post random(int rolls, Post[] entries){
        return random(rolls, entries, 0);
    }

    @Info("Post[] entries")
    public static Post random(Post[] entries){
        return random(1, entries);
    }

    @RemapForJS("if")
    @Info("@Nullable Post[] thenPosts, @Nullable Post[] elsePosts")
    public static Post ifContextual(@Nullable Post[] thenPosts, @Nullable Post[] elsePosts){
        Post post = new Post("if");
        if(thenPosts != null){
            JsonArray thenArray = new JsonArray();
            for(Post thenPost: thenPosts){
                thenArray.add(thenPost.json);
            }
            post.json.add("then", thenArray);
        }
        if(elsePosts != null){
            JsonArray elseArray = new JsonArray();
            for(Post elsePost: elsePosts){
                elseArray.add(elsePost.json);
            }
            post.json.add("else", elseArray);
        }
        return post;
    }

    @Info("boolean fire, String block_interaction, float radius, float radius_step")
    public static Post explode(boolean fire, String block_interaction, float radius, float radius_step){
        Post post = new Post("explode");
        post.json.addProperty("fire", fire);
        post.json.addProperty("block_interaction", block_interaction);
        post.json.addProperty("radius", radius);
        post.json.addProperty("radius_step", radius_step);
        return post;
    }

    @Info("boolean fire, String block_interaction")
    public static Post explode(boolean fire, String block_interaction){
        return explode(fire, block_interaction, 4, 0.5F);
    }

    @Info("boolean fire")
    public static Post explode(boolean fire){
        return explode(fire, "destroy");
    }

    @Info("String block_interaction")
    public static Post explode(String block_interaction){
        return explode(false, block_interaction);
    }

    public static Post explode(){
        return explode("destroy");
    }

    @Info("double minDamage, double maxDamage, String source")
    public static Post hurt(double minDamage, double maxDamage, String source){
        Post post = new Post("hurt");
        DoubleBounds doubleBounds = DoubleBounds.of(minDamage, maxDamage);
        post.json.add("damage", doubleBounds.getJson());
        post.json.addProperty("source", source);
        return post;
    }

    @Info("double damage, String source")
    public static Post hurt(double damage, String source){
        return hurt(damage, damage, source);
    }

    @Info("double minDamage, double maxDamage")
    public static Post hurt(double minDamage, double maxDamage){
        return hurt(minDamage, maxDamage, "generic");
    }

    @Info("double damage")
    public static Post hurt(double damage){
        return hurt(damage, "generic");
    }

    @RemapForJS("anvil_damage_chance")
    @Info("double chance")
    public static Post anvilDamageChance(double chance){
        Post post = new Post("anvil_damage_chance");
        post.json.addProperty("chance", chance);
        return post;
    }

    @RemapForJS("add_item_cooldown")
    @Info("int seconds")
    public static Post addItemCooldown(int seconds){
        Post post = new Post("add_item_cooldown");
        post.json.addProperty("s", seconds);
        return post;
    }

    @RemapForJS("move_towards_face")
    @Info("double factor")
    public static Post moveTowardsFace(double factor){
        Post post = new Post("move_towards_face");
        post.json.addProperty("factor", factor);
        return post;
    }

    @RemapForJS("move_towards_face")
    public static Post moveTowardsFace(){
        return moveTowardsFace(1);
    }

    @Info("int seconds")
    public static Post delay(int seconds){
        Post post = new Post("delay");
        post.json.addProperty("s", seconds);
        return post;
    }

    @RemapForJS("break")
    public static Post stop(){
        return new Post("break");
    }

    @RemapForJS("cycle_state_property")
    @Info("BlockPredicate_ blockPredicate, String property")
    public static Post cycleStateProperty(Object blockPredicate, String property){
        Post post = new Post("cycle_state_property");
        blockPredicate(post, blockPredicate);
        post.json.addProperty("property", property);
        return post;
    }

    @RemapForJS("prevent_default")
    public static Post preventDefault(){
        return new Post("prevent_default");
    }

    @RemapForJS("damage_item")
    @Info("int damage")
    public static Post damageItem(int damage){
        Post post = new Post("damage_item");
        post.json.addProperty("damage", damage);
        return post;
    }

    @RemapForJS("damage_item")
    public static Post damageItem(){
        return damageItem(1);
    }

    @RemapForJS("set_item")
    public static Post setItem(ItemStack item){
        Post post = new Post("set_item");
        ResourceLocation itemId = RegistryInfo.ITEM.getId(item.getItem());
        if (itemId == null) {
            throw new RecipeExceptionJS("Item " + item + " has no registry ID!");
        }
        post.json.addProperty("item", itemId.toString());
        post.json.addProperty("count", item.getCount());
        if (item.getTag() != null) {
            post.json.addProperty("nbt", item.getTag().toString());
        }
        return post;
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
    public int hashCode() {
        return Objects.hash(json);
    }

    @HideFromJS
    public static Post fromJson(JsonObject jsonObj){
        return new Post(jsonObj);
    }
}
