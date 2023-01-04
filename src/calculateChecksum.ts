import {createHash} from 'node:crypto';
import {Checksum} from './types';

export default function calculateChecksum(
  fileBytes: Buffer,
  algorithms: string[]
): Checksum {
  const checksum: Checksum = {};
  for (const algorithm of algorithms) {
    const hash = createHash(algorithm);
    hash.update(fileBytes);
    checksum[algorithm] = hash.digest('hex');
  }
  return checksum;
}
