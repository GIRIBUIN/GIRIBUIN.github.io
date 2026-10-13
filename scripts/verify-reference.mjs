// 기존 저장소에는 쓰기 작업을 하지 않습니다.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
const reference = resolve(root, '../GIRIBUIN.github.io');
const artifacts = join(root, '.verification');
const git = (...args) => execFileSync('git', ['-C', reference, ...args], { encoding: 'utf8' }).trim();
const head = readFileSync(join(artifacts, 'reference-head.txt'), 'utf8').trim();
const status = readFileSync(join(artifacts, 'reference-status.txt'), 'utf8').trim();
const hashes = JSON.parse(readFileSync(join(artifacts, 'reference-files.json'), 'utf8'));
assert.equal(git('rev-parse', 'HEAD'), head, 'Reference HEAD changed');
assert.equal(git('status', '--porcelain=v1', '--untracked-files=all'), status, 'Reference git status changed');
for (const [name, expected] of Object.entries(hashes)) {
  const actual = createHash('sha256').update(readFileSync(join(reference, name))).digest('hex').toUpperCase();
  assert.equal(actual, expected, 'Reference tracked file changed: ' + name);
}
const report = { head, status: status || 'clean', trackedFilesVerified: Object.keys(hashes).length, result: 'unchanged' };
writeFileSync(join(artifacts, 'reference-results.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
