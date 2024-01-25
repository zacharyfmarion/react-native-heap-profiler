package com.heapprofiler;

import android.content.ContentValues;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.widget.Toast;
import androidx.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

@ReactModule(name = HeapProfilerModule.NAME)
public class HeapProfilerModule extends ReactContextBaseJavaModule {
  public static final String NAME = "HeapProfiler";

  public HeapProfilerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean createSnapshot() {
    try {
      System.loadLibrary("heap-profiler");

      File tempFile = File.createTempFile("sampling-profile", ".heapsnapshot", getReactApplicationContext().getCacheDir());
      String outputPath = tempFile.getPath();

      HeapProfilerBridge.instance.createNativeSnapshot(getReactApplicationContext(), outputPath);

      Context reactContext = getReactApplicationContext();
      Toast.makeText(reactContext, "Saved results from Heap Profiler to " + outputPath, Toast.LENGTH_LONG).show();

      return true;
    } catch (Exception exception) {
      Log.e(NAME, "Failed to capture heap snapshot", exception);
      return false;
    }
  }
}
