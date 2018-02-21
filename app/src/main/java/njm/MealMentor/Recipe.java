package njm.MealMentor;

public class Recipe {
    public String title;
    public String cookingTime;
    public int imageId;

    Recipe(String title, int cookingTimeMinutes, int imageId) {
        this.title = title;
        this.cookingTime = "Cooking Time:\n" + minutesToString(cookingTimeMinutes);
        this.imageId = imageId;
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
