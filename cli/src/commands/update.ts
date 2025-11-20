import chalk from 'chalk';
import ora from 'ora';
import { readProjectConfig, getRepositoryPath, writeProjectConfig } from '../utils/config';
import { cloneOrUpdateRepository, getRepositoryInfo } from '../utils/git';

export async function updateComponents() {
  console.log(chalk.bold.blue('\n🔄 更新组件库\n'));
  
  // 读取项目配置
  const config = await readProjectConfig();
  
  if (!config || !config.repository) {
    console.log(chalk.red('错误: 项目未初始化'));
    console.log(chalk.gray('请先运行: ') + chalk.cyan('cocos-components init'));
    process.exit(1);
  }
  
  const spinner = ora('正在更新组件库...').start();
  
  try {
    const repoPath = await cloneOrUpdateRepository(config.repository);
    const repoInfo = await getRepositoryInfo(repoPath);
    
    // 更新最后更新时间
    await writeProjectConfig({
      ...config,
      lastUpdate: new Date().toISOString()
    });
    
    spinner.succeed('组件库更新成功');
    
    if (repoInfo) {
      console.log(chalk.gray(`分支: ${repoInfo.branch}`));
      console.log(chalk.gray(`最新提交: ${repoInfo.latestCommit}`));
      console.log(chalk.gray(`提交时间: ${repoInfo.latestCommitDate}`));
    }
    
    console.log(chalk.green('\n✅ 更新完成!\n'));
    
  } catch (error) {
    spinner.fail('更新失败');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

