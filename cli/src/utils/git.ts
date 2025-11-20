import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import { getCacheDir, getRepositoryPath } from './config';

/**
 * 克隆或更新组件库仓库
 */
export async function cloneOrUpdateRepository(repoUrl: string): Promise<string> {
  const repoPath = getRepositoryPath(repoUrl);
  const cacheDir = getCacheDir();
  
  // 确保缓存目录存在
  await fs.ensureDir(cacheDir);
  
  const git = simpleGit();
  
  // 如果仓库已存在，则拉取最新代码
  if (await fs.pathExists(repoPath)) {
    const repoGit = simpleGit(repoPath);
    await repoGit.pull();
  } else {
    // 否则克隆仓库
    await git.clone(repoUrl, repoPath);
  }
  
  return repoPath;
}

/**
 * 获取仓库信息
 */
export async function getRepositoryInfo(repoPath: string) {
  const git = simpleGit(repoPath);
  
  try {
    const log = await git.log({ maxCount: 1 });
    const branch = await git.branch();
    
    return {
      branch: branch.current,
      latestCommit: log.latest?.hash.substring(0, 7) || 'unknown',
      latestCommitDate: log.latest?.date || 'unknown'
    };
  } catch (error) {
    return null;
  }
}

