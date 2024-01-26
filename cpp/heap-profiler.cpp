#include "heap-profiler.h"
#include "HeapProfilerHostObject.h"
#include <jsi/instrumentation.h>

namespace heapprofiler {
    namespace jsi = facebook::jsi;

    void install(jsi::Runtime &rt) {
        auto HeapProfiler = jsi::Object::createFromHostObject(
                rt, std::make_shared<HeapProfilerHostObject>(
                       HeapProfilerHostObject()));

        rt.global().setProperty(rt, "__HeapProfiler", std::move(HeapProfiler));
    }

    void createHeapSnapshot(jsi::Runtime &rt, const std::string filePath) {
        rt.instrumentation().createSnapshotToFile(filePath);
    }
}  // namespace heapprofiler
