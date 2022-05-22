import * as core from '@actions/core';
import * as github from '@actions/github';
import * as path from 'path';
import * as glob from 'glob';
import uploadToRelease from './uploadToRelease';
import getReleaseByTag from './getReleaseByTag';

async function run(): Promise<void> {
  try {
    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const token = core.getInput('repo_token', {required: true});
    const file_name = core.getInput('file', {required: true});
    const tag = core
      .getInput('tag', {required: true})
      .replace('refs/tags/', '')
      .replace('refs/heads/', '');

    const file_glob = core.getInput('file_glob') == 'true' ? true : false;
    const overwrite = core.getInput('overwrite') == 'true' ? true : false;
    const prerelease = core.getInput('prerelease') == 'true' ? true : false;
    const release_name = core.getInput('release_name');
    const body = core.getInput('body');

    const octokit = github.getOctokit(token);
    const release = await getReleaseByTag(
      tag,
      prerelease,
      release_name,
      body,
      octokit
    );

    if (file_glob) {
      const files = glob.sync(file_name);
      if (files.length > 0) {
        for (const file of files) {
          const asset_name = path.basename(file);
          const asset_download_url = await uploadToRelease(
            release,
            file,
            asset_name,
            tag,
            overwrite,
            octokit
          );
          core.setOutput('browser_download_url', asset_download_url);
        }
      } else {
        core.setFailed('No files matching the glob pattern found.');
      }
    } else {
      const asset_name =
        core.getInput('asset_name') !== ''
          ? core.getInput('asset_name').replace(/\$tag/g, tag)
          : path.basename(file_name);
      const asset_download_url = await uploadToRelease(
        release,
        file_name,
        asset_name,
        tag,
        overwrite,
        octokit
      );
      core.setOutput('browser_download_url', asset_download_url);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
