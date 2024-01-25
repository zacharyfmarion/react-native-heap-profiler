#include "heap-profiler.h"
#include <jsi/instrumentation.h>

namespace heapprofiler {
    namespace jsi = facebook::jsi;

    void createSnapshot(jsi::Runtime &rt, const std::string filePath) {
        rt.instrumentation().createSnapshotToFile(filePath);
    }
}  // namespace heapprofiler
