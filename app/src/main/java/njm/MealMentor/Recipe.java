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
