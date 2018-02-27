package njm.MealMentor;

import android.graphics.Bitmap;
import android.os.AsyncTask;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

public class Recipe {
    public String name;
    public String cookingTime;
    public String imageURL;
    public ArrayList<String> instructions;
    public ArrayList<String> ingredients;
    public Bitmap image;
    public ArrayList<String> equipment;

    public static ArrayList<Recipe> recipeList = new ArrayList<>();

    Recipe(String name, int cookingTimeMinutes, ArrayList<String> instructions, ArrayList<String> ingredients, String imageURL, ArrayList<String> equipment) throws java.io.IOException {
        this.name = name;
        this.cookingTime = minutesToString(cookingTimeMinutes);
        this.instructions = instructions;
        this.ingredients = ingredients;
        this.imageURL = imageURL;
        this.image = null;
        this.equipment = equipment;
    }

    public static ArrayList<Recipe> getRecipes() {
        if (Recipe.recipeList.size() == 0) {
            RecipeFromDatabase task = new RecipeFromDatabase();
            try {
                task.execute().get();
            }
            catch(InterruptedException|ExecutionException e) {
                throw new RuntimeException(e);
            }
        }
        return Recipe.recipeList;
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

    private static class RecipeFromDatabase extends AsyncTask<Void, Void, Void> {
        @Override
        protected Void doInBackground(Void... params) {
            if (Recipe.recipeList.size() == 0) {
                URL url;
                HttpURLConnection urlConnection;
                BufferedReader br;
                try {
                    url = new URL("http://loljkl.pw:1500");
                    urlConnection = (HttpURLConnection) url.openConnection();
                    br = new BufferedReader(new InputStreamReader(url.openStream()));
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
                        recipeList.add(r);
                    }
                }
                catch(IOException|JSONException e) {
                    throw new RuntimeException(e);
                }
            }
            return null;
        }
    }

    private String minutesToString(int time) {
        int hours = time / 60; //since both are ints, you get an int
        int minutes = time % 60;
        String result = "";
        if (minutes != 0) {
            result = minutes + " minute";
            if (minutes != 1) {
                result += "s";
            }
        }
        if (hours != 0) {
            if (result.length() != 0) {
                result = ", " + result;
            }
            String temp = hours + " hour";
            if (hours != 1) {
                temp += "s";
            }
            result = temp + result;
        }
        return result;
    }
}
