package com.shakzz.play;

import android.os.Bundle;
import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.os.Handler;
import android.os.Looper;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // CRITICAL FOR COLD START FIX:
        // This switches the app FROM your new LauncherTheme (which shows the instant logo)
        // BACK to the normal black theme right before the UI actually loads.
        // If you don't do this, the logo stays stuck behind your web app forever!
        setTheme(R.style.AppTheme_NoActionBar);

        // Request window features before super.onCreate
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        super.onCreate(savedInstanceState);

        // Force black background immediately
        getWindow().setBackgroundDrawableResource(android.R.color.black);

        // Force dark navigation and status bar
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // 1. Properly add the Window flag to draw system bar backgrounds
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);

            getWindow().setNavigationBarColor(Color.BLACK);
            getWindow().setStatusBarColor(Color.BLACK);

            // 2. Use the correct View flag for layout stability
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            );
        }

        // --- CUSTOM NATIVE SPLASH SCREEN LOGIC ---

        // 1. Grab your perfectly centered XML layout
        View splashView = getLayoutInflater().inflate(R.layout.activity_splash, findViewById(android.R.id.content), false);

        // 2. Overlay it directly on top of the Capacitor Web App
        addContentView(splashView, new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // 3. Keep it on screen for 3 seconds, then remove it
        new Handler(Looper.getMainLooper()).postDelayed(() ->
                        ((ViewGroup) splashView.getParent()).removeView(splashView),
                1000); // 3000 milliseconds = 3 seconds
    }
}