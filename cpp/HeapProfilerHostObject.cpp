#include "HeapProfilerHostObject.h";
#include <jsi/instrumentation.h>

namespace heapprofiler {
		std::vector<jsi::PropNameID> HeapProfilerHostObject::getPropertyNames(
        jsi::Runtime &rt)
    {
        std::vector<jsi::PropNameID> keys;
        const char *names[] = {"getHeapInfo"};
        for (const auto &name : names)
        {
            keys.push_back(jsi::PropNameID::forAscii(rt, name));
        }
        return keys;
    };

    jsi::Value HeapProfilerHostObject::get(jsi::Runtime &rt, const jsi::PropNameID &propNameID)
    {
        std::string propName = propNameID.utf8(rt);

        if (propName == "getHeapInfo") {
            return HOST_FN(rt, "getHeapInfo", 1, {
                if (count != 1 || !arguments[0].isBool()) {
                    throw jsi::JSError(rt, "getHeapInfo expects a single boolean argument");
                }
                bool includeExpensive = arguments[0].getBool();
                auto heapInfo = rt.instrumentation().getHeapInfo(includeExpensive);
                jsi::Object result(rt);
                for (const auto& pair : heapInfo) {
                    result.setProperty(rt, jsi::PropNameID::forUtf8(rt, pair.first), jsi::Value((double)pair.second));
                }
                return result;
            });
        }

        return jsi::Value::undefined();
    }
}
