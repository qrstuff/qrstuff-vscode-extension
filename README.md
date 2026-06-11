# QRStuff VS Code & Cursor Extension

Official VS Code and Cursor IDE extension for the QRStuff platform. This extension automatically registers the QRStuff Model Context Protocol (MCP) server in your IDE configurations, provides a user-friendly sidebar for OAuth authentication, and enables AI assistants to seamlessly generate and manage QR codes.

---

## Features

1. **Zero-Config MCP Setup**: Automatically configures the QRStuff MCP server in Cursor, VS Code, and Google Antigravity/Gemini CLI settings on activation.
2. **Branded Connection Sidebar**: Offers a visual sidebar panel displaying connection status and quick access to the QRStuff Dashboard.
3. **AI Tool Integration**: Empowers your editor's AI assistants (such as Cursor Chat, Cline, Roo Code, or Google Antigravity) to directly execute QRStuff tools.

---

## Local Development and Compilation

To compile the extension locally from source:

1. Clone the repository and navigate into it:
   ```bash
   git clone git@github.com:qrstuff/qrstuff-vscode-extension.git
   cd qrstuff-vscode-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the TypeScript source code:
   ```bash
   npm run compile
   ```

4. Package the extension into a `.vsix` bundle:
   ```bash
   # Install the VS Code Extension CLI globally if not already installed
   npm install -g @vscode/vsce
   
   # Package the extension
   vsce package
   ```
   This will generate a file named `qrstuff-vscode-extension-0.1.0.vsix` in your root directory.

---

## Local Testing Guide

### 1. Visual Studio Code
- Open VS Code.
- Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
- Click the `...` (Views and More Actions) button at the top right of the Extensions panel.
- Select **Install from VSIX...** and select the compiled `qrstuff-vscode-extension-0.1.0.vsix` file.
- Verify that a new **QRStuff** icon appears on the Activity Bar. Click it to open the Connection Manager sidebar view.

### 2. Cursor IDE
- Open Cursor.
- Go to the Extensions tab and install the compiled `.vsix` file via **Install from VSIX...**.
- Once installed and activated, the extension will automatically write the MCP server configuration.
- To verify the connection:
  - Open **Cursor Settings** (`Ctrl+Shift+J` or `Cmd+Shift+J`).
  - Go to **Features** > **MCP**.
  - You should see the `qrstuff` server successfully registered with the URL pointing to `https://mcp.qrstuff.ai/mcp`.
  - Restart Cursor or click reload on the server, then ask Cursor Chat:
    > "Generate a QR code for https://google.com using QRStuff"

### 3. Google Antigravity
- Verify that the extension is installed in your development environment.
- On startup, the extension automatically injects the `qrstuff` server configuration into your local Antigravity config files.
- To verify:
  - Check the config file path at `~/.gemini/antigravity/mcp_config.json`.
  - You should see the following server entry added under `mcpServers`:
    ```json
    "mcpServers": {
      "qrstuff": {
        "url": "https://mcp.qrstuff.ai/mcp"
      }
    }
    ```
  - Start an Antigravity prompt session and verify that the QRStuff tools (e.g., `list_projects`, `generate_qr_code`) are active and accessible.
