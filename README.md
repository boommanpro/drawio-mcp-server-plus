# Draw.io MCP Server Plus

这是 [drawio-mcp-server](https://github.com/lgazo/drawio-mcp-server) 和 [drawio-mcp-extension](https://github.com/lgazo/drawio-mcp-extension) 的合并增强版本，提供了更多功能和改进。

[![Build project](https://github.com/lgazo/drawio-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/lgazo/drawio-mcp-server/actions/workflows/ci.yml)
[![Build project](https://github.com/lgazo/drawio-mcp-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/lgazo/drawio-mcp-extension/actions/workflows/ci.yml)

## 注意

本项目不做npm发布，仅能自身研究开发使用。

## 简介

Draw.io MCP Server Plus 是一个 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 实现，它将强大的图表功能与AI代理系统相结合。这个增强版本在原始项目的基础上进行了改进，增加了对 iframe 嵌套的支持和完整的 XML 导入功能。

该工具使 AI 系统能够：
- 无缝集成 Draw.io 的丰富图表功能
- 通过 MCP 命令以编程方式创建、修改和管理图表内容
- 检索有关图表及其组件的详细信息以供 AI 代理进一步处理
- 构建复杂的 AI 工作流，将可视化建模和图表自动化纳入其中

## 增强功能

相较于原始项目，此增强版本包含以下改进：

### 🖼️ iframe 嵌套支持
- 支持在 iframe 中嵌入和操作 Draw.io 图表
- 提供更灵活的集成选项，适用于各种 Web 应用环境

### 📄 完整 XML 导入能力
- 支持导入完整的 Draw.io XML 文件
- 能够处理复杂图表结构和自定义样式
- 保持图表的所有原始属性和关系
![trae](https://github.com/boommanpro/drawio-mcp-server-plus/blob/main/docs/image/img.png?raw=true)
![demo](https://github.com/boommanpro/drawio-mcp-server-plus/blob/main/docs/image/img_1.png?raw=true)

### 🧩 统一代码库
- 合并了 server 和 extension 两个项目
- 简化了开发和维护流程
- 提供更一致的版本控制和发布管理

## 核心组件

### Draw.io MCP Server
MCP 服务端实现，提供与 AI 代理系统的接口：
- 实现了完整的 MCP 协议
- 提供图表检查和修改工具
- 支持与各种 MCP 客户端（如 Claude Desktop、Zed 等）集成

### Draw.io MCP Extension
浏览器扩展，作为 Draw.io 和 MCP Server 之间的桥梁：
- 在浏览器中与 Draw.io 实例通信
- 执行来自 MCP Server 的命令
- 将图表信息返回给服务端

## 安装和使用

请参考各子项目的文档获取详细的安装和配置说明：

- [drawio-mcp-server/README.md](drawio-mcp-server/README.md)
- [drawio-mcp-extension/README.md](drawio-mcp-extension/README.md)

## 相关资源

- [Troubleshooting](drawio-mcp-server/TROUBLESHOOTING.md)
- [Prompt examples](drawio-mcp-server/docs/examples/index.md)
- [Contributing](drawio-mcp-server/CONTRIBUTING.md)
- [Architecture](drawio-mcp-server/ARCHITECTURE.md)
- [Development](drawio-mcp-server/DEVELOPMENT.md)

## 原始项目

本项目基于以下两个开源项目：
- [drawio-mcp-server](https://github.com/lgazo/drawio-mcp-server)
- [drawio-mcp-extension](https://github.com/lgazo/drawio-mcp-extension)

感谢原作者 [Ladislav Gazo](https://github.com/lgazo) 的杰出工作。

## 许可证

本项目采用 MIT 许可证，详情请见 [LICENSE](drawio-mcp-server/LICENSE) 文件。
