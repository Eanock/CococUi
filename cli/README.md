# Cocos Components CLI

CLI 工具用于管理和安装 WePlayCocos 组件库。

## 安装

### 从源码安装

```bash
# 克隆仓库
git clone https://gitlab.yourcompany.com/your-group/weplay-cocos-components.git
cd weplay-cocos-components/cli

# 安装依赖
npm install

# 构建
npm run build

# 全局安装
npm link
```

### 从 npm 安装（如果已发布）

```bash
npm install -g cocos-components-cli
```

## 使用

### 初始化项目

```bash
cocos-components init
```

### 列出组件

```bash
cocos-components list
```

### 添加组件

```bash
cocos-components add <component-name>
```

### 更新组件库

```bash
cocos-components update
```

## 开发

```bash
# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 测试
npm start -- --help
```

## 命令

### `init`

初始化 Cocos Creator 项目配置。

```bash
cocos-components init [options]

Options:
  -r, --repository <url>  组件库 Git 仓库地址
```

### `list`

列出所有可用组件。

```bash
cocos-components list [options]

Aliases:
  ls

Options:
  -t, --type <type>       按类型筛选（ui/logic/effect/utility）
  -s, --search <keyword>  搜索组件
```

### `add`

添加组件到项目。

```bash
cocos-components add [components...] [options]

Options:
  -o, --overwrite         覆盖已存在的文件
  -p, --path <path>       指定组件安装路径（相对于 assets 目录）
```

### `update`

更新本地组件库缓存。

```bash
cocos-components update
```

## 许可证

MIT

