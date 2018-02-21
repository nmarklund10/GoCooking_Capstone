package njm.MealMentor;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.view.View;

import java.util.Collections;
import java.util.List;

public class RecipeAdapter extends RecyclerView.Adapter<RecipeViewHolder>{
    List<Recipe> recipeList = Collections.emptyList();
    Context context;

    public RecipeAdapter(List<Recipe> recipeList, Context context) {
        this.recipeList = recipeList;
        this.context = context;
    }

    @Override
    public RecipeViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        //Inflate the layout, initialize the View Holder
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.recipe_row_layout, parent, false);
        return new RecipeViewHolder(v);

    }

    @Override
    public void onBindViewHolder(RecipeViewHolder holder, int position) {

        //Use the provided View Holder on the onCreateViewHolder method to populate the current row on the RecyclerView
        holder.title.setText(recipeList.get(position).title);
        holder.description.setText(recipeList.get(position).cookingTime);
        holder.imageView.setImageResource(recipeList.get(position).imageId);
        //animate(holder);

    }

    @Override
    public int getItemCount() {
        //returns the number of elements the RecyclerView will display
        return recipeList.size();
    }

    @Override
    public void onAttachedToRecyclerView(RecyclerView recyclerView) {
        super.onAttachedToRecyclerView(recyclerView);
    }

    // Insert a new item to the RecyclerView on a predefined position
    public void insert(int position, Recipe recipe) {
        recipeList.add(position, recipe);
        notifyItemInserted(position);
    }

    // Remove a RecyclerView item containing a specified Data object
    public void remove(Recipe recipe) {
        int position = recipeList.indexOf(recipe);
        recipeList.remove(position);
        notifyItemRemoved(position);
    }
}
