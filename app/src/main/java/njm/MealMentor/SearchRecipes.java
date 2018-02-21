package njm.MealMentor;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import java.util.ArrayList;
import java.util.List;

import static android.widget.GridLayout.HORIZONTAL;


public class SearchRecipes extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_recipes);

        List<Recipe> recipes = getRecipes();

        RecyclerView recyclerView = findViewById(R.id.recyclerView);
        RecipeAdapter adapter = new RecipeAdapter(recipes, getApplication());
        recyclerView.setAdapter(adapter);
        GridLayoutManager manager = new GridLayoutManager(this, 2, HORIZONTAL, false);
        recyclerView.setLayoutManager(manager);
        recyclerView.addItemDecoration(new SpacesItemDecoration(2));
    }

    //Create a list of Data objects
    public List<Recipe> getRecipes() {

        List<Recipe> recipes = new ArrayList<>();

        recipes.add(new Recipe("Batman vs Superman", 180, R.drawable.ic_texas_am));
        recipes.add(new Recipe("X-Men: Apocalypse", 50, R.drawable.ic_texas_am));
        recipes.add(new Recipe("Captain America: Civil War", 67, R.drawable.ic_texas_am));
        recipes.add(new Recipe("Kung Fu Panda 3", 28, R.drawable.ic_texas_am));
        recipes.add(new Recipe("Warcraft", 300, R.drawable.ic_texas_am));
        recipes.add(new Recipe("Alice in Wonderland", 12, R.drawable.ic_texas_am));

        recipes.add(new Recipe("Batman vs Superman", 100, R.drawable.ic_texas_am));
        recipes.add(new Recipe("X-Men: Apocalypse", 61, R.drawable.ic_texas_am));
        recipes.add(new Recipe("Captain America: Civil War", 40, R.drawable.ic_texas_am));
        recipes.add(new Recipe("Kung Fu Panda 3", 240, R.drawable.ic_texas_am));
        recipes.add(new Recipe("Warcraft", 20, R.drawable.ic_texas_am));
        recipes.add(new Recipe("Alice in Wonderland", 30, R.drawable.ic_texas_am));

        return recipes;
    }

    public void backToMain(View view) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }
}
