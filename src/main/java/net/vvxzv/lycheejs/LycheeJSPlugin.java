package net.vvxzv.lycheejs;

import dev.latvian.mods.kubejs.KubeJSPlugin;
import dev.latvian.mods.kubejs.recipe.schema.RegisterRecipeSchemasEvent;
import dev.latvian.mods.kubejs.script.BindingsEvent;
import net.minecraft.resources.ResourceLocation;
import net.vvxzv.lycheejs.schema.*;
import net.vvxzv.lycheejs.utils.BlockPredicate;
import net.vvxzv.lycheejs.utils.Contextual;
import net.vvxzv.lycheejs.utils.LocationPredicate;
import net.vvxzv.lycheejs.utils.Post;

public class LycheeJSPlugin extends KubeJSPlugin {
    @Override
    @SuppressWarnings("removal")
    public void registerRecipeSchemas(RegisterRecipeSchemasEvent event) {
        event.register(new ResourceLocation("lychee:block_interacting"), BlockInteracting.SCHEMA);
        event.register(new ResourceLocation("lychee:block_clicking"), BlockInteracting.SCHEMA);
        event.register(new ResourceLocation("lychee:item_burning"), ItemBurning.SCHEMA);
        event.register(new ResourceLocation("lychee:item_inside"), ItemInside.SCHEMA);
        event.register(new ResourceLocation("lychee:anvil_crafting"), AnvilCrafting.SCHEMA);
        event.register(new ResourceLocation("lychee:block_crushing"), BlockCrushing.SCHEMA);
        event.register(new ResourceLocation("lychee:lightning_channeling"), LightningChanneling.SCHEMA);
        event.register(new ResourceLocation("lychee:item_exploding"), ItemExploding.SCHEMA);
        event.register(new ResourceLocation("lychee:block_exploding"), BlockExploding.SCHEMA);
        event.register(new ResourceLocation("lychee:random_block_ticking"), RandomBlockTicking.SCHEMA);
        event.register(new ResourceLocation("lychee:dripstone_dripping"), DripstoneDripping.SCHEMA);
    }

    @Override
    public void registerBindings(BindingsEvent event) {
        event.add("BlockPredicate", BlockPredicate.class);
        event.add("Post", Post.class);
        event.add("Contextual", Contextual.class);
        event.add("LocationPredicate", LocationPredicate.class);
    }
}
