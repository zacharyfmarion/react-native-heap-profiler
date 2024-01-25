#!/usr/bin/env node
import getContext from '@react-native-community/cli-config';
import { logger, CLIError } from '@react-native-community/cli-tools';
import { execSync } from 'child_process';
import type { Config } from '@react-native-community/cli-types';
import { getAndroidProject } from '@react-native-community/cli-platform-android';

// Most of the file is just a copy of https://github.com/react-native-community/cli/blob/main/packages/cli-hermes/src/profileHermes/downloadProfile.ts

/**
 * Get the last modified hermes profile
 * @param packageNameWithSuffix
 */
function getLatestFile(packageNameWithSuffix: string): string {
  try {
    const file =
      execSync(`adb shell run-as ${packageNameWithSuffix} ls cache/ -tp | grep -v /$ | grep -E '.heapsnapshot' | head -1
        `);
    return file.toString().trim();
  } catch (e) {
    throw e;
  }
}

function execSyncWithLog(command: string) {
  logger.debug(`${command}`);
  return execSync(command);
}

/**
 * Pull and convert a Hermes tracing profile to Chrome tracing profile
 * @param ctx
 * @param appId
 */
export async function downloadProfile(
  ctx: Config,
  appId?: string,
  dstPath?: string
) {
  try {
    const androidProject = getAndroidProject(ctx);
    const packageNameWithSuffix = appId || androidProject.packageName;

    // If file name is not specified, pull the latest file from device
    let file = getLatestFile(packageNameWithSuffix);

    if (!file) {
      throw new CLIError('There is no file in the cache/ directory.');
    }

    logger.info(`File to be pulled: ${file}`);

    // If destination path is not specified, pull to the current directory
    dstPath = dstPath || ctx.root;

    logger.debug('Internal commands run to pull the file:');

    // If --raw, pull the hermes profile to dstPath
    execSyncWithLog(
      `adb shell run-as ${packageNameWithSuffix} cat cache/${file} > ${dstPath}/${file}`
    );

    logger.success(`Successfully pulled the file to ${dstPath}/${file}`);
  } catch (e) {
    throw e;
  }
}

const { program } = require('commander');

program.requiredOption('--appId <string>').option('--dstPath <string>');

program.parse();

const options = program.opts();
downloadProfile(getContext(), options.appId, options.dstPath);
