import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

export interface ComponentFile {
  source: string;
  target: string;
  type: 'script' | 'prefab' | 'scene' | 'texture' | 'material' | 'animation' | 'other';
}

export interface ComponentMetadata {
  name: string;
  displayName?: string;
  type: 'ui' | 'logic' | 'effect' | 'utility';
  description?: string;
  version?: string;
  files: ComponentFile[];
  dependencies?: string[];
  tags?: string[];
}

export interface RegistryComponent {
  name: string;
  path: string;
  displayName?: string;
  type?: string;
}

export interface Registry {
  components: RegistryComponent[];
}

/**
 * 读取组件注册表
 */
export async function readRegistry(repoPath: string): Promise<Registry> {
  const registryPath = path.join(repoPath, 'components', 'registry.json');
  
  if (!await fs.pathExists(registryPath)) {
    return { components: [] };
  }
  
  return await fs.readJson(registryPath);
}

/**
 * 读取组件元数据
 */
export async function readComponentMetadata(
  repoPath: string,
  componentPath: string
): Promise<ComponentMetadata | null> {
  const metadataPath = path.join(repoPath, componentPath, 'component.json');
  
  if (!await fs.pathExists(metadataPath)) {
    return null;
  }
  
  try {
    return await fs.readJson(metadataPath);
  } catch (error) {
    return null;
  }
}

/**
 * 获取组件的所有依赖（递归）
 */
export async function getComponentDependencies(
  repoPath: string,
  componentName: string,
  registry: Registry,
  resolved: Set<string> = new Set()
): Promise<string[]> {
  if (resolved.has(componentName)) {
    return [];
  }
  
  resolved.add(componentName);
  
  const component = registry.components.find(c => c.name === componentName);
  if (!component) {
    return [];
  }
  
  const metadata = await readComponentMetadata(repoPath, component.path);
  if (!metadata || !metadata.dependencies) {
    return [];
  }
  
  const allDeps: string[] = [];
  
  for (const dep of metadata.dependencies) {
    const subDeps = await getComponentDependencies(repoPath, dep, registry, resolved);
    allDeps.push(...subDeps);
    allDeps.push(dep);
  }
  
  return allDeps;
}

/**
 * 复制组件文件到目标项目
 */
export async function copyComponentFiles(
  repoPath: string,
  componentPath: string,
  metadata: ComponentMetadata,
  targetProjectPath: string,
  options: {
    overwrite?: boolean;
    customPath?: string;
  } = {}
): Promise<{ copied: string[]; skipped: string[] }> {
  const copied: string[] = [];
  const skipped: string[] = [];
  const assetsDir = path.join(targetProjectPath, 'assets');
  
  for (const file of metadata.files) {
    const sourcePath = path.join(repoPath, componentPath, file.source);
    
    // 如果指定了自定义路径，则使用自定义路径
    let targetPath: string;
    if (options.customPath) {
      const fileName = path.basename(file.target);
      targetPath = path.join(assetsDir, options.customPath, fileName);
    } else {
      targetPath = path.join(assetsDir, file.target);
    }
    
    // 检查源文件是否存在
    if (!await fs.pathExists(sourcePath)) {
      console.warn(`警告: 源文件不存在: ${sourcePath}`);
      continue;
    }
    
    // 检查目标文件是否已存在
    if (await fs.pathExists(targetPath) && !options.overwrite) {
      skipped.push(file.target);
      continue;
    }
    
    // 确保目标目录存在
    await fs.ensureDir(path.dirname(targetPath));
    
    // 复制文件
    await fs.copy(sourcePath, targetPath, { overwrite: options.overwrite });
    copied.push(file.target);
    
    // 如果是 .ts 或 .prefab 文件，还需要复制 .meta 文件
    const metaSourcePath = `${sourcePath}.meta`;
    if (await fs.pathExists(metaSourcePath)) {
      const metaTargetPath = `${targetPath}.meta`;
      await fs.copy(metaSourcePath, metaTargetPath, { overwrite: options.overwrite });
    }
  }
  
  return { copied, skipped };
}

/**
 * 搜索组件
 */
export function searchComponents(
  registry: Registry,
  keyword?: string,
  type?: string
): RegistryComponent[] {
  let filtered = [...registry.components];
  
  if (type) {
    filtered = filtered.filter(c => c.type === type);
  }
  
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(lowerKeyword) ||
      c.displayName?.toLowerCase().includes(lowerKeyword)
    );
  }
  
  return filtered;
}

