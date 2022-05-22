import {Endpoints} from '@octokit/types';

export type RepoAssetsResp =
  Endpoints['GET /repos/{owner}/{repo}/releases/{release_id}/assets']['response']['data'];
export type ReleaseByTagResp =
  Endpoints['GET /repos/{owner}/{repo}/releases/tags/{tag}']['response'];
export type CreateReleaseResp =
  Endpoints['POST /repos/{owner}/{repo}/releases']['response'];
export type UploadAssetResp =
  Endpoints['POST {origin}/repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}']['response'];
