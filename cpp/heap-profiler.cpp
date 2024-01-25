#include "heap-profiler.h"
#include <jsi/instrumentation.h>

namespace heapprofiler {
    namespace jsi = facebook::jsi;

    void createHeapSnapshot(jsi::Runtime &rt, const std::string filePath) {
        rt.instrumentation().createHeapSnapshotToFile(filePath);
    }
}  // namespace heapprofiler
