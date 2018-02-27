package njm.MealMentor;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.view.View;
import android.widget.ImageView;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;

public class RecipeAdapter extends RecyclerView.Adapter<RecipeViewHolder>{
    ArrayList<Recipe> recipeList = new ArrayList<>();
    Context context;

    public RecipeAdapter(ArrayList recipeList, Context context) {
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
        holder.title.setText(recipeList.get(position).name);
        holder.description.setText(recipeList.get(position).cookingTime);
        holder.imageView.setImageBitmap(recipeList.get(position).image);
        if (recipeList.get(position).image == null)
            new DownloadImageTask(holder.imageView).execute(recipeList.get(position).imageURL);
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView bmImage;

        public DownloadImageTask(ImageView bmImage) {
            this.bmImage = bmImage;
        }

        protected Bitmap doInBackground(String... urls) {
            String urldisplay = urls[0];
            Bitmap image;
            try {
                InputStream in = new URL(urldisplay).openStream();
                image = BitmapFactory.decodeStream(in);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            return image;
        }

        protected void onPostExecute(Bitmap result) {
            bmImage.setImageBitmap(result);
        }
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
