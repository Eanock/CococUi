import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export interface ProjectConfig {
  repository?: string;
  componentsPath?: string;
  lastUpdate?: string;
}

export interface ComponentLibraryConfig {
  name: string;
  version: string;
  description: string;
  repository: {
    type: string;
    url: string;
  };
  components: {
    directory: string;
    assets_directory: string;
  };
}

const CONFIG_FILE_NAME = '.cocos-components.json';
const CACHE_DIR = path.join(os.homedir(), '.cocos-components-cache');

/**
 * 获取项目配置文件路径
 */
export function getProjectConfigPath(): string {
  const cwd = process.cwd();
  return path.join(cwd, CONFIG_FILE_NAME);
}

/**
 * 获取缓存目录路径
 */
export function getCacheDir(): string {
  return CACHE_DIR;
}

/**
 * 读取项目配置
 */
export async function readProjectConfig(): Promise<ProjectConfig | null> {
  const configPath = getProjectConfigPath();
  
  if (!await fs.pathExists(configPath)) {
    return null;
  }
  
  try {
    return await fs.readJson(configPath);
  } catch (error) {
    return null;
  }
}

/**
 * 写入项目配置
 */
export async function writeProjectConfig(config: ProjectConfig): Promise<void> {
  const configPath = getProjectConfigPath();
  await fs.writeJson(configPath, config, { spaces: 2 });
}

/**
 * 检查是否为 Cocos Creator 项目
 */
export async function isCocosProject(): Promise<boolean> {
  const cwd = process.cwd();
  const indicators = [
    'assets',
    'settings',
    'package.json'
  ];
  
  for (const indicator of indicators) {
    const exists = await fs.pathExists(path.join(cwd, indicator));
    if (!exists) return false;
  }
  
  return true;
}

/**
 * 获取组件库仓库路径（本地缓存）
 */
export function getRepositoryPath(repoUrl: string): string {
  const repoName = path.basename(repoUrl, '.git');
  return path.join(CACHE_DIR, repoName);
}

/**
 * 读取组件库配置
 */
export async function readLibraryConfig(repoPath: string): Promise<ComponentLibraryConfig | null> {
  const configPath = path.join(repoPath, 'cocos-components.config.json');
  
  if (!await fs.pathExists(configPath)) {
    return null;
  }
  
  try {
    return await fs.readJson(configPath);
  } catch (error) {
    return null;
  }
}

