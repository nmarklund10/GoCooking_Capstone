package njm.MealMentor;

import android.content.Intent;
import android.graphics.Color;
import android.speech.RecognizerIntent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;

import com.miguelcatalan.materialsearchview.MaterialSearchView;

import java.util.ArrayList;

import static android.widget.GridLayout.HORIZONTAL;


public class SearchRecipes extends AppCompatActivity {
    private MaterialSearchView searchView;
    private ArrayList<Recipe> recipes;
    private RecipeAdapter adapter;
    private RecyclerView recyclerView;
    private GridLayoutManager manager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_recipes);
        Toolbar myToolbar = findViewById(R.id.toolbar);
        setSupportActionBar(myToolbar);
        myToolbar.setTitleTextColor(Color.parseColor("#FFFFFF"));
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowTitleEnabled(false);
        searchView = findViewById(R.id.search_view);
        searchView.setVoiceSearch(true);
        recipes = Recipe.getRecipes();
        recyclerView = findViewById(R.id.recyclerView);
        adapter = new RecipeAdapter(recipes, getApplication());
        recyclerView.setAdapter(adapter);
        manager = new GridLayoutManager(this, 2, HORIZONTAL, false);
        recyclerView.setLayoutManager(manager);
        recyclerView.addItemDecoration(new SpacesItemDecoration(2));
        searchView.setOnQueryTextListener(new MaterialSearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                searchView.closeSearch();
                onQueryTextChange(query);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String searchText) {
                if (searchText != null && !searchText.isEmpty()) {
                    ArrayList<Recipe> matches = new ArrayList<>();
                    for (Recipe item:recipes) {
                        String recipeTitle = item.name.toLowerCase();
                        String query = searchText.toLowerCase();
                        if (recipeTitle.contains(query)) {
                            matches.add(item);
                        }
                    }
                    RecipeAdapter searchResults = new RecipeAdapter(matches, getApplication());
                    recyclerView.setAdapter(searchResults);
                }
                else {
                    recyclerView.setAdapter(adapter);
                }
                return true;
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == MaterialSearchView.REQUEST_VOICE && resultCode == RESULT_OK) {
            ArrayList<String> matches = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
            if (matches != null && matches.size() > 0) {
                String searchWrd = matches.get(0);
                if (!TextUtils.isEmpty(searchWrd)) {
                    searchView.setQuery(searchWrd, false);
                }
            }

            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.options_menu, menu);

        MenuItem item = menu.findItem(R.id.action_search);
        searchView.setMenuItem(item);

        return true;
    }

    @Override
    public void onBackPressed() {
        if (searchView.isSearchOpen()) {
            searchView.closeSearch();
        } else {
            super.onBackPressed();
        }
    }
}
