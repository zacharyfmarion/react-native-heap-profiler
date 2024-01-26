#ifndef HEAPPROFILER_HOSTOBJECT_H
#define HEAPPROFILER_HOSTOBJECT_H

#include "utils.h"

namespace heapprofiler {
    namespace jsi = facebook::jsi;

    class JSI_EXPORT HeapProfilerHostObject : public jsi::HostObject {
    public:
        HeapProfilerHostObject() {};

        std::vector<jsi::PropNameID> getPropertyNames(jsi::Runtime &rt);
        jsi::Value get(jsi::Runtime &rt, const jsi::PropNameID &propNameID);

    private:
    };

}  // namespace heapprofiler

#endif // HEAPPROFILER_HOSTOBJECT_H