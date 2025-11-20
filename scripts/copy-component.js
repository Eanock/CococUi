#!/usr/bin/env node

/**
 * 简单的组件复制工具
 * 可以直接运行，不需要构建
 * 
 * 用法：
 * node scripts/copy-component.js button
 * 或者从 npm 发布后：
 * npx cocos-ui add button
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const REPO_URL = 'https://gitlab.yourcompany.com/your-group/weplay-cocos-components.git';
const CACHE_DIR = path.join(require('os').homedir(), '.cocos-components-cache');
const LIBRARY_PATH = 'assets/_library';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function error(message) {
  log(`✗ ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function info(message) {
  log(`ℹ ${message}`, 'cyan');
}

// 检查是否是 Cocos 项目
function isCocosProject() {
  return fs.existsSync('assets') && 
         fs.existsSync('settings') && 
         fs.existsSync('package.json');
}

// 克隆或更新仓库
function cloneOrUpdateRepo() {
  const repoName = path.basename(REPO_URL, '.git');
  const repoPath = path.join(CACHE_DIR, repoName);

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  if (fs.existsSync(repoPath)) {
    log('更新组件库...', 'gray');
    try {
      execSync('git pull', { cwd: repoPath, stdio: 'pipe' });
      success('组件库已更新');
    } catch (err) {
      error('更新失败: ' + err.message);
    }
  } else {
    log('首次使用，正在下载组件库...', 'gray');
    try {
      execSync(`git clone ${REPO_URL} ${repoPath}`, { stdio: 'pipe' });
      success('组件库下载完成');
    } catch (err) {
      error('下载失败: ' + err.message);
    }
  }

  return repoPath;
}

// 读取组件注册表
function readRegistry(repoPath) {
  const registryPath = path.join(repoPath, LIBRARY_PATH, 'registry.json');
  if (!fs.existsSync(registryPath)) {
    error('找不到组件注册表');
  }
  return JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
}

// 读取组件元数据
function readComponentMetadata(repoPath, componentPath) {
  const metadataPath = path.join(repoPath, componentPath, 'component.json');
  if (!fs.existsSync(metadataPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
}

// 复制文件
function copyFile(src, dest, overwrite = false) {
  if (fs.existsSync(dest) && !overwrite) {
    return false;
  }

  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.copyFileSync(src, dest);
  
  // 复制 .meta 文件（如果存在）
  const metaSrc = src + '.meta';
  const metaDest = dest + '.meta';
  if (fs.existsSync(metaSrc)) {
    fs.copyFileSync(metaSrc, metaDest);
  }
  
  return true;
}

// 复制组件
function copyComponent(repoPath, componentName, options = {}) {
  const registry = readRegistry(repoPath);
  const component = registry.components.find(c => c.name === componentName);

  if (!component) {
    error(`组件 "${componentName}" 不存在`);
  }

  info(`正在添加组件: ${component.displayName || componentName}`);

  const metadata = readComponentMetadata(repoPath, component.path);
  if (!metadata) {
    error('无法读取组件元数据');
  }

  const copied = [];
  const skipped = [];

  for (const file of metadata.files) {
    const sourcePath = path.join(repoPath, component.path, file.source);
    let targetPath;

    if (options.path) {
      // 自定义路径
      const fileName = path.basename(file.target);
      targetPath = path.join(process.cwd(), 'assets', options.path, fileName);
    } else {
      // 默认路径：从 _library 复制到 components
      const relativePath = file.target.replace('assets/_library/', 'assets/components/');
      targetPath = path.join(process.cwd(), relativePath);
    }

    if (!fs.existsSync(sourcePath)) {
      log(`  警告: 源文件不存在 ${sourcePath}`, 'yellow');
      continue;
    }

    if (copyFile(sourcePath, targetPath, options.overwrite)) {
      copied.push(path.relative(process.cwd(), targetPath));
    } else {
      skipped.push(path.relative(process.cwd(), targetPath));
    }
  }

  if (copied.length > 0) {
    success(`已复制 ${copied.length} 个文件:`);
    copied.forEach(file => log(`  ${file}`, 'gray'));
  }

  if (skipped.length > 0) {
    log(`\n跳过 ${skipped.length} 个已存在的文件:`, 'yellow');
    skipped.forEach(file => log(`  ${file}`, 'gray'));
    log('\n提示: 使用 --overwrite 参数覆盖已存在的文件', 'gray');
  }
}

// 列出所有组件
function listComponents(repoPath, options = {}) {
  const registry = readRegistry(repoPath);
  
  log('\n📦 可用组件列表\n', 'blue');

  const filtered = registry.components.filter(c => {
    if (options.type && c.type !== options.type) return false;
    if (options.search) {
      const keyword = options.search.toLowerCase();
      return c.name.toLowerCase().includes(keyword) ||
             (c.displayName && c.displayName.toLowerCase().includes(keyword));
    }
    return true;
  });

  // 按类型分组
  const grouped = {};
  filtered.forEach(c => {
    const type = c.type || 'other';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(c);
  });

  const typeInfo = {
    ui: { icon: '🎨', label: 'UI 组件', color: 'cyan' },
    logic: { icon: '⚙️ ', label: '逻辑组件', color: 'green' },
    effect: { icon: '✨', label: '特效组件', color: 'yellow' },
    utility: { icon: '🔧', label: '工具组件', color: 'yellow' },
    other: { icon: '📦', label: '其他', color: 'gray' }
  };

  Object.entries(grouped).forEach(([type, components]) => {
    const info = typeInfo[type] || typeInfo.other;
    log(`\n${info.icon} ${info.label}:`, info.color);
    log('─'.repeat(50), 'gray');
    
    components.forEach(c => {
      const displayName = c.displayName || c.name;
      log(`  ${c.name.padEnd(25)} ${displayName}`, 'gray');
    });
  });

  log('\n' + '─'.repeat(50), 'gray');
  log(`总计: ${filtered.length} 个组件\n`, 'gray');
  log('使用方法: node scripts/copy-component.js <component-name>\n', 'gray');
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Cocos Components - 组件管理工具

用法:
  node scripts/copy-component.js <component-name> [options]
  node scripts/copy-component.js list [options]

命令:
  <component-name>    添加组件到项目
  list, ls           列出所有可用组件

选项:
  --overwrite, -o    覆盖已存在的文件
  --path <path>      指定安装路径（相对于 assets 目录）
  --type <type>      按类型筛选（ui/logic/effect/utility）
  --search <keyword> 搜索组件
  --help, -h         显示帮助信息

示例:
  node scripts/copy-component.js button
  node scripts/copy-component.js button --overwrite
  node scripts/copy-component.js button --path ui/common
  node scripts/copy-component.js list
  node scripts/copy-component.js list --type ui
  node scripts/copy-component.js list --search button
`);
    process.exit(0);
  }

  // 检查是否是 Cocos 项目
  if (!isCocosProject()) {
    error('当前目录不是 Cocos Creator 项目');
  }

  // 解析参数
  const command = args[0];
  const options = {
    overwrite: args.includes('--overwrite') || args.includes('-o'),
    path: args.includes('--path') ? args[args.indexOf('--path') + 1] : null,
    type: args.includes('--type') ? args[args.indexOf('--type') + 1] : null,
    search: args.includes('--search') ? args[args.indexOf('--search') + 1] : null
  };

  // 克隆或更新仓库
  const repoPath = cloneOrUpdateRepo();

  // 执行命令
  if (command === 'list' || command === 'ls') {
    listComponents(repoPath, options);
  } else {
    copyComponent(repoPath, command, options);
    success('\n✨ 完成！请在 Cocos Creator 中查看添加的组件\n');
  }
}

// 运行
try {
  main();
} catch (err) {
  error(err.message);
}

