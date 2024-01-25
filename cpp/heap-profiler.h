#ifndef HEAPPROFILER_H
#define HEAPPROFILER_H

#include "utils.h"

namespace heapprofiler {
    void createSnapshot(facebook::jsi::Runtime &runtime, const std::string filePath);
}

#endif /* HEAPPROFILER_H */
