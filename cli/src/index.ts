#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { addComponent } from './commands/add';
import { listComponents } from './commands/list';
import { initProject } from './commands/init';
import { updateComponents } from './commands/update';

const program = new Command();

program
  .name('cocos-components')
  .description('WePlayCocos 组件库 CLI 工具')
  .version('1.0.0');

// init 命令 - 初始化项目配置
program
  .command('init')
  .description('在当前 Cocos 项目中初始化组件库配置')
  .option('-r, --repository <url>', '组件库 Git 仓库地址')
  .action(initProject);

// add 命令 - 添加组件
program
  .command('add [components...]')
  .description('添加一个或多个组件到当前项目')
  .option('-o, --overwrite', '覆盖已存在的文件', false)
  .option('-p, --path <path>', '指定组件安装路径（相对于 assets 目录）')
  .action(addComponent);

// list 命令 - 列出所有可用组件
program
  .command('list')
  .alias('ls')
  .description('列出所有可用的组件')
  .option('-t, --type <type>', '按类型筛选（ui/logic/effect/utility）')
  .option('-s, --search <keyword>', '搜索组件')
  .action(listComponents);

// update 命令 - 更新组件库
program
  .command('update')
  .description('更新本地组件库缓存')
  .action(updateComponents);

program.parse();

