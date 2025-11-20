import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import {
  readProjectConfig,
  getRepositoryPath,
  isCocosProject
} from '../utils/config';
import {
  readRegistry,
  readComponentMetadata,
  getComponentDependencies,
  copyComponentFiles
} from '../utils/component';

interface AddOptions {
  overwrite?: boolean;
  path?: string;
}

export async function addComponent(componentNames: string[], options: AddOptions) {
  console.log(chalk.bold.blue('\n📦 添加组件到项目\n'));
  
  // 检查是否为 Cocos 项目
  if (!await isCocosProject()) {
    console.log(chalk.red('错误: 当前目录不是有效的 Cocos Creator 项目'));
    process.exit(1);
  }
  
  // 读取项目配置
  const config = await readProjectConfig();
  
  if (!config || !config.repository) {
    console.log(chalk.red('错误: 项目未初始化'));
    console.log(chalk.gray('请先运行: ') + chalk.cyan('cocos-components init'));
    process.exit(1);
  }
  
  // 如果没有指定组件，显示交互式选择
  if (!componentNames || componentNames.length === 0) {
    const repoPath = getRepositoryPath(config.repository);
    const registry = await readRegistry(repoPath);
    
    if (registry.components.length === 0) {
      console.log(chalk.yellow('组件库中没有可用的组件'));
      return;
    }
    
    const choices = registry.components.map(c => ({
      title: `${c.displayName || c.name} ${chalk.gray(`(${c.name})`)}`,
      value: c.name,
      description: c.type
    }));
    
    const response = await prompts({
      type: 'multiselect',
      name: 'components',
      message: '选择要添加的组件:',
      choices,
      instructions: false,
      hint: '- 空格选择, 回车确认'
    });
    
    if (!response.components || response.components.length === 0) {
      console.log(chalk.gray('取消操作'));
      return;
    }
    
    componentNames = response.components;
  }
  
  const repoPath = getRepositoryPath(config.repository);
  const registry = await readRegistry(repoPath);
  const projectPath = process.cwd();
  
  // 处理每个组件
  for (const componentName of componentNames) {
    console.log(chalk.cyan(`\n处理组件: ${componentName}`));
    
    // 查找组件
    const component = registry.components.find(c => c.name === componentName);
    
    if (!component) {
      console.log(chalk.red(`  ✗ 组件 "${componentName}" 不存在`));
      continue;
    }
    
    // 读取组件元数据
    const metadata = await readComponentMetadata(repoPath, component.path);
    
    if (!metadata) {
      console.log(chalk.red(`  ✗ 无法读取组件元数据`));
      continue;
    }
    
    // 检查依赖
    const dependencies = await getComponentDependencies(
      repoPath,
      componentName,
      registry
    );
    
    if (dependencies.length > 0) {
      console.log(chalk.gray(`  依赖项: ${dependencies.join(', ')}`));
      
      const { installDeps } = await prompts({
        type: 'confirm',
        name: 'installDeps',
        message: '是否同时安装依赖组件？',
        initial: true
      });
      
      if (installDeps) {
        for (const depName of dependencies) {
          const depComponent = registry.components.find(c => c.name === depName);
          if (!depComponent) continue;
          
          const depMetadata = await readComponentMetadata(repoPath, depComponent.path);
          if (!depMetadata) continue;
          
          console.log(chalk.gray(`  安装依赖: ${depName}`));
          
          await copyComponentFiles(
            repoPath,
            depComponent.path,
            depMetadata,
            projectPath,
            {
              overwrite: options.overwrite,
              customPath: options.path
            }
          );
        }
      }
    }
    
    // 复制组件文件
    const spinner = ora(`  复制文件...`).start();
    
    try {
      const result = await copyComponentFiles(
        repoPath,
        component.path,
        metadata,
        projectPath,
        {
          overwrite: options.overwrite,
          customPath: options.path
        }
      );
      
      spinner.succeed('文件复制完成');
      
      if (result.copied.length > 0) {
        console.log(chalk.green(`  ✓ 已复制 ${result.copied.length} 个文件`));
        result.copied.forEach(file => {
          console.log(chalk.gray(`    - ${file}`));
        });
      }
      
      if (result.skipped.length > 0) {
        console.log(chalk.yellow(`  ⚠ 跳过 ${result.skipped.length} 个已存在的文件`));
        result.skipped.forEach(file => {
          console.log(chalk.gray(`    - ${file}`));
        });
        console.log(chalk.gray(`    提示: 使用 --overwrite 参数覆盖已存在的文件`));
      }
      
    } catch (error) {
      spinner.fail('复制失败');
      console.error(chalk.red(`  ${error}`));
    }
  }
  
  console.log(chalk.green('\n✅ 完成!\n'));
  console.log(chalk.gray('请在 Cocos Creator 编辑器中查看添加的组件'));
  console.log();
}

