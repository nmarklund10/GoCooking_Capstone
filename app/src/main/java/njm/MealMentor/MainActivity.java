package njm.MealMentor;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import org.opencv.android.OpenCVLoader;
import org.opencv.android.BaseLoaderCallback;
import org.opencv.android.LoaderCallbackInterface;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private BaseLoaderCallback mLoaderCallback = new BaseLoaderCallback(this) {
        @Override
        public void onManagerConnected(int status) {
            switch(status) {
                case LoaderCallbackInterface.SUCCESS:
                    Log.i(TAG,"OpenCV Manager Connected");
                    //from now onwards, you can use OpenCV API
                    break;
                default:
                    super.onManagerConnected(status);
                    break;
            }
        }
    };
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        OpenCVLoader.initAsync(OpenCVLoader.OPENCV_VERSION_3_4_0, this, mLoaderCallback);
    }

    public void goToSearchRecipes(View view) {
        Intent intent = new Intent(this, SearchRecipes.class);
        startActivity(intent);
    }

    public void goToRefGuide(View view) {
        Intent intent = new Intent(this, ReferenceGuide.class);
        startActivity(intent);
    }

    public void goToTutorial(View view) {
        Intent intent = new Intent(this, Tutorial.class);
        startActivity(intent);
    }
}