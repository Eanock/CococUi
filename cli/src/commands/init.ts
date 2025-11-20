import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import {
  isCocosProject,
  writeProjectConfig,
  readProjectConfig
} from '../utils/config';
import { cloneOrUpdateRepository } from '../utils/git';

export async function initProject(options: { repository?: string }) {
  console.log(chalk.bold.blue('\n🎮 初始化 Cocos 组件库配置\n'));
  
  // 检查是否为 Cocos 项目
  const spinner = ora('检查项目类型...').start();
  const isCocos = await isCocosProject();
  
  if (!isCocos) {
    spinner.fail(chalk.red('错误: 当前目录不是有效的 Cocos Creator 项目'));
    process.exit(1);
  }
  
  spinner.succeed('检测到 Cocos Creator 项目');
  
  // 检查是否已经初始化
  const existingConfig = await readProjectConfig();
  
  if (existingConfig && !options.repository) {
    console.log(chalk.yellow('\n⚠️  项目已经初始化过了'));
    
    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: '是否要重新配置？',
      initial: false
    });
    
    if (!confirm) {
      console.log(chalk.gray('取消操作'));
      return;
    }
  }
  
  // 获取仓库地址
  let repoUrl = options.repository;
  
  if (!repoUrl) {
    const response = await prompts({
      type: 'text',
      name: 'repository',
      message: '请输入组件库 Git 仓库地址:',
      initial: existingConfig?.repository || '',
      validate: value => value.trim() ? true : '仓库地址不能为空'
    });
    
    if (!response.repository) {
      console.log(chalk.red('\n取消操作'));
      process.exit(0);
    }
    
    repoUrl = response.repository;
  }
  
  // 克隆或更新仓库
  const cloneSpinner = ora('获取组件库...').start();
  
  try {
    await cloneOrUpdateRepository(repoUrl!);
    cloneSpinner.succeed('组件库获取成功');
  } catch (error) {
    cloneSpinner.fail('组件库获取失败');
    console.error(chalk.red(error));
    process.exit(1);
  }
  
  // 保存配置
  await writeProjectConfig({
    repository: repoUrl,
    componentsPath: 'assets/components',
    lastUpdate: new Date().toISOString()
  });
  
  console.log(chalk.green('\n✅ 初始化完成!\n'));
  console.log(chalk.gray('现在你可以使用以下命令:'));
  console.log(chalk.cyan('  cocos-components list') + chalk.gray(' - 查看所有可用组件'));
  console.log(chalk.cyan('  cocos-components add <component>') + chalk.gray(' - 添加组件到项目'));
  console.log();
}

