#import "HeapProfiler.h"

#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import <jsi/jsi.h>
#import "../cpp/heap-profiler.h"

@implementation HeapProfiler
RCT_EXPORT_MODULE(HeapProfiler)

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(createHeapSnapshot) {
    NSLog(@"Taking heap snapshot");

    RCTBridge *bridge = [RCTBridge currentBridge];
    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)bridge;
    if (cxxBridge == nil) {
        return @false;
    }

    using namespace facebook;

    auto jsiRuntime = (jsi::Runtime *)cxxBridge.runtime;
    if (jsiRuntime == nil) {
        return @false;
    }
    auto &runtime = *jsiRuntime;

    NSFileManager* sharedFM = [NSFileManager defaultManager];
    NSURL *appDir=[[sharedFM URLsForDirectory:NSCachesDirectory inDomains:NSUserDomainMask] objectAtIndex:0];
    NSString * tempFilename = [NSString stringWithFormat:@"heapprofile-%@%@", [[NSProcessInfo processInfo] globallyUniqueString], @".heapsnapshot"];
    NSURL *fileURL=[appDir URLByAppendingPathComponent:tempFilename];

    NSLog(@"Directory for heap snapshot: %@", fileURL.path);

    std::string finalPath = std::string([fileURL.path UTF8String]);

    BOOL fileCreated = [sharedFM createFileAtPath:fileURL.path
                                     contents:[@"" dataUsingEncoding:NSUTF8StringEncoding]
                                   attributes:nil];
    if (!fileCreated) {
        NSLog(@"Failed to create file at path: %@", fileURL.path);
        return @false;
    }

    heapprofiler::createHeapSnapshot(runtime, finalPath);

    return fileURL.path;
}

@end
