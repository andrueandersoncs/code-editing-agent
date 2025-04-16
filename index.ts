import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, tool } from "ai";
import { z } from "zod";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const readFile = tool({
  description: `Read the contents of a given relative file path. Use this when you want to see what's inside a file. Do not use this with directory names.`,
  parameters: z.object({
    path: z
      .string()
      .describe("The relative path of a file in the working directory."),
  }),
  execute: async ({ path }) => {
    try {
      return readFileSync(path).toString();
    } catch (e: any) {
      return e.toString();
    }
  },
});

const listFiles = tool({
  description: `List files and directories at a given path. If no path is provided, the current directory is used.`,
  parameters: z.object({
    path: z
      .string()
      .optional()
      .describe(
        "Optional relative path to list files and directories from. Defaults to current directory if not provided."
      ),
  }),
  execute: async ({ path }) => {
    try {
      return readdirSync(path || "./", { withFileTypes: true }).map((dirent) =>
        dirent.isFile() ? dirent.name : dirent.name + "/"
      );
    } catch (e: any) {
      return e.toString();
    }
  },
});

const editFile = tool({
  description: `Make edits to a text file.

Replaces 'old_str' with 'new_str' in the given file. 'old_str' and 'new_str' MUST be different from each other.

If the file specified with path doesn't exist, it will be created.`,
  parameters: z.object({
    path: z
      .string()
      .nonempty()
      .describe("The path to the file. Cannot be empty."),
    old_str: z
      .string()
      .describe(
        "Text to search for - must match exactly and must only have one match exactly"
      ),
    new_str: z.string().describe("Text to replace old_str with"),
  }),
  execute: async ({ path, old_str, new_str }) => {
    if (old_str === new_str) {
      return "Error: Invalid input parameters: 'old_str' cannot equal 'new_str'";
    }

    try {
      const content = readFileSync(path).toString("utf8");
      const newContent = content.replace(old_str, new_str);

      if (content === newContent && old_str !== "") {
        return "Error: 'old_str' was not found in the file";
      }

      writeFileSync(path, newContent);

      return "Success: file edits were applied.";
    } catch (error: any) {
      if (!("code" in error)) return "Error: An unknown error occurred.";

      if (error.code === "ENOENT" && old_str === "") {
        const dirname = path.split("/").slice(0, -1).join("/");

        if (dirname) {
          mkdirSync(dirname, { recursive: true });
        }

        writeFileSync(path, new_str);

        return `Success: New file has been created at ${path}`;
      }

      return `Error: ${error}`;
    }
  },
});

async function main() {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const response = await generateText({
    model: openrouter("openai/gpt-4.1"),
    system:
      "Do as the user requests, do not ask for confirmation. Prefer tool calls over text responses.",
    prompt: Bun.argv[2],
    tools: {
      read_file: readFile,
      list_files: listFiles,
      edit_file: editFile,
    },
    maxSteps: 5, // allow up to 5 steps
  });

  console.log("Response:", JSON.stringify(response.response.messages, null, 2));

  return response;
}

main();
