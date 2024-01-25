package com.heapprofiler;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.turbomodule.core.CallInvokerHolderImpl;

public class HeapProfilerBridge {
  private native void createNativeSnapshotJsi(long jsContextNativePointer, String filePath);

  public static final HeapProfilerBridge instance = new HeapProfilerBridge();

  public void createNativeSnapshot(ReactContext context, String filePath) {
    long jsContextPointer = context.getJavaScriptContextHolder().get();
    createNativeSnapshotJsi(jsContextPointer, filePath);
  }
}
