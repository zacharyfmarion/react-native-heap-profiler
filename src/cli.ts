#!/usr/bin/env node
import getContext from '@react-native-community/cli-config';
import { logger, CLIError } from '@react-native-community/cli-tools';
import { execSync } from 'child_process';
import type { Config } from '@react-native-community/cli-types';
import { getAndroidProject } from '@react-native-community/cli-platform-android';

// Most of the file is just a copy of https://github.com/react-native-community/cli/blob/main/packages/cli-hermes/src/profileHermes/downloadProfile.ts

/**
 * Get the last modified hermes profile
 */
function getLatestFile(packageName: string): string {
  try {
    const file =
      execSync(`adb shell run-as ${packageName} ls cache/ -tp | grep -v /$ | grep -E '.heapsnapshot' | head -1
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
 * Pull a heap snapshot from an android device
 */
export async function downloadProfile(
  ctx: Config,
  appId?: string,
  outputDir?: string
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
    outputDir = outputDir || ctx.root;

    logger.debug('Internal commands run to pull the file:');

    // If --raw, pull the hermes profile to outputDir
    execSyncWithLog(
      `adb shell run-as ${packageNameWithSuffix} cat cache/${file} > ${outputDir}/${file}`
    );

    logger.success(`Successfully pulled the file to ${outputDir}/${file}`);
  } catch (e) {
    throw e;
  }
}

const { program } = require('commander');

program.requiredOption('--appId <string>').option('--outputDir <string>');

program.parse();

const options = program.opts();
downloadProfile(getContext(), options.appId, options.outputDir);
