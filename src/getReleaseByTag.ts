import * as core from '@actions/core';
import {GitHub} from '@actions/github/lib/utils';

import getRepo from './getRepo';
import {ReleaseByTagResp, CreateReleaseResp} from './types';

export default async function getReleaseByTag(
  tag: string,
  prerelease: boolean,
  release_name: string,
  body: string,
  octokit: InstanceType<typeof GitHub>
): Promise<ReleaseByTagResp | CreateReleaseResp> {
  try {
    core.debug(`Getting release by tag ${tag}.`);
    return await octokit.rest.repos.getReleaseByTag({
      ...getRepo(),
      tag: tag
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If this returns 404, we need to create the release first.
    if (error.status === 404) {
      core.debug(
        `Release for tag ${tag} doesn't exist yet so we'll create it now.`
      );
      return await octokit.rest.repos.createRelease({
        ...getRepo(),
        tag_name: tag,
        prerelease: prerelease,
        name: release_name,
        body: body
      });
    } else {
      throw error;
    }
  }
}
