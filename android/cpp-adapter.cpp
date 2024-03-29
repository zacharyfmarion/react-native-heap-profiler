#include "heap-profiler.h"

#include <fbjni/fbjni.h>
#include <jni.h>
#include <jsi/jsi.h>

using namespace facebook;

struct HeapProfilerBridge : jni::JavaClass<HeapProfilerBridge> {
  static constexpr auto kJavaDescriptor =
      "Lcom/heapprofiler/HeapProfilerBridge;";

  static void registerNatives() {
    javaClassStatic()->registerNatives(
        {
         makeNativeMethod("installNativeJsi", HeapProfilerBridge::installNativeJsi),
         makeNativeMethod("createNativeSnapshotJsi", HeapProfilerBridge::createNativeSnapshotJsi)
        });
  }

private:
  static void installNativeJsi(jni::alias_ref<jni::JObject> thiz, jlong jsiRuntimePtr) {
    auto jsiRuntime = reinterpret_cast<jsi::Runtime *>(jsiRuntimePtr);
    heapprofiler::install(*jsiRuntime);
  }

  static void createNativeSnapshotJsi(jni::alias_ref<jni::JObject> thiz, jlong jsiRuntimePtr, jstring jFilePath) {
    auto jsiRuntime = reinterpret_cast<jsi::Runtime *>(jsiRuntimePtr);
    std::string filePath = fromJavaString(jFilePath);
    heapprofiler::createHeapSnapshot(*jsiRuntime, filePath);
  }

  // Helper function to convert JNI string to C++ string
  static std::string fromJavaString(jstring jStr) {
    auto env = jni::Environment::current();
    const char *charStr = env->GetStringUTFChars(jStr, nullptr);
    std::string result(charStr);
    env->ReleaseStringUTFChars(jStr, charStr);
    return result;
  }
};

JNIEXPORT jint JNI_OnLoad(JavaVM *vm, void *) {
  return jni::initialize(vm, [] { HeapProfilerBridge::registerNatives(); });
}
