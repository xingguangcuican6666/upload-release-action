import * as core from '@actions/core';
import * as github from '@actions/github';

export default function repo(): {owner: string; repo: string} {
  let repo_name = core.getInput('repo_name');
  // If we're not targeting a foreign repository, we can just return immediately and don't have to do extra work.
  if (!repo_name) {
    return github.context.repo;
  }
  const owner = repo_name.substring(0, repo_name.indexOf('/'));
  if (!owner) {
    throw new Error(
      `Could not extract 'owner' from 'repo_name': ${repo_name}.`
    );
  }
  repo_name = repo_name.substring(repo_name.indexOf('/') + 1);
  if (!repo) {
    throw new Error(`Could not extract 'repo' from 'repo_name': ${repo_name}.`);
  }
  return {
    owner,
    repo: repo_name
  };
}
