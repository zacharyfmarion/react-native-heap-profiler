#ifdef __cplusplus
#import "heap-profiler.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNHeapProfiler.h"

@interface HeapProfiler : NSObject <NativeHeapProfilerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface HeapProfiler : NSObject <RCTBridgeModule>
#endif

@end
