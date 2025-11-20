import chalk from 'chalk';
import ora from 'ora';
import { readProjectConfig, getRepositoryPath, readLibraryConfig } from '../utils/config';
import { readRegistry, searchComponents } from '../utils/component';
import { getRepositoryInfo } from '../utils/git';

interface ListOptions {
  type?: string;
  search?: string;
}

export async function listComponents(options: ListOptions) {
  console.log(chalk.bold.blue('\n📦 可用组件列表\n'));
  
  // 读取项目配置
  const config = await readProjectConfig();
  
  if (!config || !config.repository) {
    console.log(chalk.red('错误: 项目未初始化'));
    console.log(chalk.gray('请先运行: ') + chalk.cyan('cocos-components init'));
    process.exit(1);
  }
  
  const spinner = ora('加载组件列表...').start();
  
  try {
    const repoPath = getRepositoryPath(config.repository);
    const registry = await readRegistry(repoPath);
    const libraryConfig = await readLibraryConfig(repoPath);
    const repoInfo = await getRepositoryInfo(repoPath);
    
    spinner.succeed('组件列表加载成功');
    
    // 显示仓库信息
    if (libraryConfig) {
      console.log(chalk.bold(libraryConfig.name) + chalk.gray(` v${libraryConfig.version}`));
      if (libraryConfig.description) {
        console.log(chalk.gray(libraryConfig.description));
      }
    }
    
    if (repoInfo) {
      console.log(chalk.gray(`分支: ${repoInfo.branch} | 提交: ${repoInfo.latestCommit}\n`));
    }
    
    // 搜索和过滤组件
    const filteredComponents = searchComponents(
      registry,
      options.search,
      options.type
    );
    
    if (filteredComponents.length === 0) {
      console.log(chalk.yellow('没有找到匹配的组件'));
      return;
    }
    
    // 按类型分组
    const grouped = filteredComponents.reduce((acc, component) => {
      const type = component.type || 'other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(component);
      return acc;
    }, {} as Record<string, typeof filteredComponents>);
    
    // 类型图标和名称映射
    const typeInfo: Record<string, { icon: string; label: string; color: (str: string) => string }> = {
      ui: { icon: '🎨', label: 'UI 组件', color: chalk.cyan },
      logic: { icon: '⚙️ ', label: '逻辑组件', color: chalk.green },
      effect: { icon: '✨', label: '特效组件', color: chalk.magenta },
      utility: { icon: '🔧', label: '工具组件', color: chalk.yellow },
      other: { icon: '📦', label: '其他', color: chalk.gray }
    };
    
    // 显示组件列表
    Object.entries(grouped).forEach(([type, components]) => {
      const info = typeInfo[type] || typeInfo.other;
      console.log(info.color(`\n${info.icon} ${info.label}:`));
      console.log(chalk.gray('─'.repeat(50)));
      
      components.forEach(component => {
        const displayName = component.displayName || component.name;
        console.log(
          '  ' + info.color(component.name.padEnd(25)) +
          chalk.gray(displayName)
        );
      });
    });
    
    console.log(chalk.gray('\n─'.repeat(50)));
    console.log(chalk.gray(`总计: ${filteredComponents.length} 个组件\n`));
    console.log(chalk.gray('使用方法: ') + chalk.cyan('cocos-components add <component-name>'));
    console.log();
    
  } catch (error) {
    spinner.fail('加载失败');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

