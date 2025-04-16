# 🤖 Code Editing Agent

A lightweight, powerful AI-powered code editing assistant that helps you modify your codebase through natural language commands.

## 🌟 Features

- **Natural Language Code Editing**: Modify your code by describing what you want in plain English
- **File Management**: Read and list files with simple commands
- **Smart Edits**: Precisely replace code segments without manual search
- **File Creation**: Generate new files on demand
- **Powered by GPT-4.1**: Leverages OpenRouter to connect to advanced AI models

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/code-editing-agent.git
cd code-editing-agent

# Install dependencies
bun install

# Set up your environment variables
cp .env.local.example .env.local
# Edit .env.local to add your OPENROUTER_API_KEY
```

## 🔧 Configuration

Create a `.env.local` file with your OpenRouter API key:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

You can get an API key from [OpenRouter](https://openrouter.ai).

## 📋 Usage

Run the agent with a natural language command:

```bash
bun run index.ts "Create a new React component called Button that accepts variant and size props"
```

The agent will:

1. Parse your request
2. Use the appropriate tools to edit or create files
3. Return a summary of the changes

## 🛠️ Available Tools

The agent provides three primary tools:

- **read_file**: Read the contents of a file
- **list_files**: List all files in a directory
- **edit_file**: Make changes to existing files or create new ones

## 🔄 How It Works

The agent uses the Vercel AI SDK and OpenRouter to connect to powerful AI models. When you provide a command, it:

1. Interprets your request
2. Plans the necessary file operations
3. Executes them using the appropriate tools
4. Returns the results

## 📝 License

MIT

## 🙏 Acknowledgements

- [Bun](https://bun.sh) - Fast JavaScript runtime
- [OpenRouter](https://openrouter.ai) - AI model provider
- [Vercel AI SDK](https://github.com/vercel/ai) - Tools for building AI interfaces

---

This project was created using `bun init` in bun v1.2.2.
