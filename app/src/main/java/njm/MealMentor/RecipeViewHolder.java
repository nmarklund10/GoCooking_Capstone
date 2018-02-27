package njm.MealMentor;

import android.content.res.Resources;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

public class RecipeViewHolder extends RecyclerView.ViewHolder {
    CardView cv;
    TextView title;
    TextView description;
    ImageView imageView;

    RecipeViewHolder(View itemView) {
        super(itemView);
        cv = itemView.findViewById(R.id.recipeCardView);
        title = itemView.findViewById(R.id.recipeTitle);
        description = itemView.findViewById(R.id.recipeDescription);
        imageView = itemView.findViewById(R.id.recipeImage);
        cv.getLayoutParams().width = Resources.getSystem().getDisplayMetrics().widthPixels / 2;
        imageView.getLayoutParams().width = Resources.getSystem().getDisplayMetrics().heightPixels / 3;
        imageView.getLayoutParams().height = Resources.getSystem().getDisplayMetrics().heightPixels / 3;
    }
}
