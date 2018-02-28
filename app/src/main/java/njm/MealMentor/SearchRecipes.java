package njm.MealMentor;

import android.graphics.Color;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.TextView;

import com.miguelcatalan.materialsearchview.MaterialSearchView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;

import static android.widget.GridLayout.HORIZONTAL;


public class SearchRecipes extends AppCompatActivity {
    protected MaterialSearchView searchView;
    protected RecyclerView recyclerView;
    protected GridLayoutManager manager;
    protected RecipeSearchAdapter adapter;
    protected TextView noResult;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_recipes);
        Toolbar myToolbar = findViewById(R.id.toolbar);
        setSupportActionBar(myToolbar);
        myToolbar.setTitleTextColor(Color.parseColor("#FFFFFF"));
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowTitleEnabled(false);
        noResult = findViewById(R.id.noResultText);
        noResult.setText("");
        searchView = findViewById(R.id.search_view);
        new SetupActivity().execute();
        recyclerView = findViewById(R.id.recyclerView);
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
                    for (Recipe item:Recipe.recipeList) {
                        String recipeTitle = item.name.toLowerCase();
                        String query = searchText.toLowerCase();
                        if (recipeTitle.contains(query)) {
                            matches.add(item);
                        }
                    }
                    RecipeSearchAdapter searchResults = new RecipeSearchAdapter(matches, getApplication());
                    recyclerView.setAdapter(searchResults);
                    if (matches.size() == 0) {
                        noResult.setText(R.string.noResults);
                    }
                    else {
                        noResult.setText("");
                    }
                }
                else {
                    if (recyclerView.getAdapter() != adapter) {
                        recyclerView.setAdapter(adapter);
                    }
                    if (noResult.getText().toString().equals(getString(R.string.noResults))) {
                        noResult.setText("");
                    }
                }
                return true;
            }
        });
    }

    public static ArrayList<String> JSONArrayToArrayList(JSONArray json) {
        ArrayList<String> result = new ArrayList<>();
        for (int i = 0; i < json.length(); ++i) {
            try {
                result.add(json.getString(i));
            }
            catch(JSONException e) {
                throw new RuntimeException(e);
            }
        }
        return result;
    }

    private class SetupActivity extends AsyncTask<Void, Void, Void> {
        @Override
        protected Void doInBackground(Void... params) {
            if (Recipe.recipeList.size() == 0) {
                try {
                    BufferedReader br = new BufferedReader(new InputStreamReader(new URL("http://loljkl.pw:1500").openStream()));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        sb.append(line + "\n");
                    }
                    br.close();
                    String jsonString = sb.toString();
                    JSONArray recipes = new JSONArray(jsonString);
                    for (int i = 0; i < recipes.length(); ++i) {
                        JSONObject recipe = recipes.getJSONObject(i);
                        String name = recipe.getString("name");
                        int minutes = recipe.getInt("minutes");
                        ArrayList<String> instructions = JSONArrayToArrayList(new JSONArray(recipe.getString("instructions")));
                        ArrayList<String> ingredients = JSONArrayToArrayList(new JSONArray(recipe.getString("ingredients")));
                        String image = recipe.getString("image");
                        ArrayList<String> equipment = JSONArrayToArrayList(new JSONArray(recipe.getString("equipment")));
                        Recipe r = new Recipe(name, minutes, instructions, ingredients, image, equipment);
                        Recipe.recipeList.add(r);
                    }
                }
                catch(IOException e) {
                    throw new RuntimeException(e);
                }
                catch(JSONException e) {
                    return null;
                }
            }
            updateUI();
            return null;
        }

        private void updateUI() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    adapter = new RecipeSearchAdapter(Recipe.recipeList, getApplication());
                    recyclerView.setAdapter(adapter);
                }
            });
        }
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
            if (recyclerView.getAdapter() != adapter) {
                recyclerView.setAdapter(adapter);
            }        }
        else if (recyclerView.getAdapter() != adapter) {
            recyclerView.setAdapter(adapter);
        }else {
            super.onBackPressed();
        }
        if (noResult.getText().toString().equals(getString(R.string.noResults))) {
            noResult.setText("");
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        if (searchView.isSearchOpen()) {
            searchView.closeSearch();
            if (recyclerView.getAdapter() != adapter)
                recyclerView.setAdapter(adapter);
        }
        else if (recyclerView.getAdapter() != adapter) {
            recyclerView.setAdapter(adapter);
        }else {
            super.onSupportNavigateUp();
        }
        return false;
    }
}
