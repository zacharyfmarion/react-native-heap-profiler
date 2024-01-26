#ifndef HEAPPROFILER_H
#define HEAPPROFILER_H

#include "utils.h"

namespace heapprofiler {
    void install(facebook::jsi::Runtime &runtime);
    void createHeapSnapshot(facebook::jsi::Runtime &runtime, const std::string filePath);
}

#endif /* HEAPPROFILER_H */
