# Draw.io MCP Server 开发模式启动方式

在开发 Draw.io MCP Server 时，有几种不同的启动方式，适用于不同的开发和调试场景。

## 1. 基本开发模式（监听文件变化）

使用以下命令启动开发模式，它会监听文件变化并自动重新编译：

```bash
cd drawio-mcp-server
pnpm run dev
```

这个命令会启动 TypeScript 编译器的监听模式，当源代码发生变化时自动重新编译。

## 2. 使用 MCP Inspector 调试

MCP Inspector 是一个用于调试 MCP 服务器的工具。要使用它来调试 Draw.io MCP Server：

1. 首先确保已经构建了项目：
   ```bash
   cd drawio-mcp-server
   pnpm run build
   ```

2. 启动 MCP Inspector：
   ```bash
   pnpm run inspect
   ```

3. 每次重新构建 MCP 服务器脚本后，需要在 Inspector 工具中点击"Restart"。
4. 如果更改了工具定义，应该点击"Clear"然后重新"List"工具。

## 3. 调试模式

如果需要调试 MCP 服务器代码，可以使用以下配置：

```json
{
  "mcpServers": {
    "drawio": {
      "command": "node",
      "args": ["--inspect", "build/index.js"]
    }
  }
}
```

然后通过 Chrome Debugger 连接调试器，打开 `chrome://inspect`。

## 4. 测试模式

在开发过程中，可以运行测试来验证代码的正确性：

```bash
# 运行测试
pnpm run test

# 持续监听模式下运行测试
pnpm run test:watch

# 检查代码覆盖率
pnpm run test:coverage
```

## 5. 构建和验证

在开发完成后，构建项目并验证代码质量：

```bash
# 构建项目
pnpm run build

# 验证代码质量
pnpm run test

# 检查代码覆盖率
pnpm run test:coverage
```

## 6. 直接运行（开发环境）

在开发环境中，也可以直接运行编译后的代码：

```bash
# 首先确保代码已编译
pnpm run build

# 然后运行
node build/index.js
```

## 开发流程建议

1. 在一个终端中运行 `pnpm run dev` 监听文件变化
2. 在另一个终端中运行 `pnpm run test:watch` 持续运行测试
3. 修改代码后，使用 MCP Inspector 或其他 MCP 客户端测试功能
4. 提交前运行 `pnpm run test` 和 `pnpm run build` 确保代码质量