package com.heapprofiler;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;

public class HeapProfilerBridge {
  private native void installNativeJsi(long jsContextNativePointer);
  private native void createNativeSnapshotJsi(long jsContextNativePointer, String filePath);

  public static final HeapProfilerBridge instance = new HeapProfilerBridge();

  public void install(ReactContext context) {
    long jsContextPointer = context.getJavaScriptContextHolder().get();
    installNativeJsi(jsContextPointer);
  }

  public void createNativeSnapshot(ReactContext context, String filePath) {
    long jsContextPointer = context.getJavaScriptContextHolder().get();
    createNativeSnapshotJsi(jsContextPointer, filePath);
  }
}
