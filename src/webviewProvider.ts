import * as vscode from 'vscode';

export class QRStuffWebviewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case 'configure': {
                    vscode.commands.executeCommand('qrstuff.configureMCP');
                    break;
                }
                case 'openUrl': {
                    if (data.url) {
                        vscode.env.openExternal(vscode.Uri.parse(data.url));
                    }
                    break;
                }
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview: any): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QRStuff MCP Manager</title>
    <style>
        body {
            font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
            color: var(--vscode-foreground);
            background-color: transparent;
            padding: 15px;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .card {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.25));
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .header {
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.15));
            padding-bottom: 10px;
        }

        .logo-text {
            font-size: 1.2rem;
            font-weight: bold;
            letter-spacing: 0.5px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .status-container {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #4cd964;
            box-shadow: 0 0 8px #4cd964;
            display: inline-block;
        }

        .description {
            font-size: 0.85rem;
            line-height: 1.4;
            color: var(--vscode-descriptionForeground, #858585);
        }

        .btn {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-size: 0.85rem;
            text-align: center;
            transition: background-color 0.2s, transform 0.1s;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
        }

        .btn:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        .btn:active {
            transform: scale(0.98);
        }

        .btn-secondary {
            background-color: transparent;
            border: 1px solid var(--vscode-button-background);
            color: var(--vscode-button-background);
        }

        .btn-secondary:hover {
            background-color: rgba(0, 122, 255, 0.1);
        }

        .footer {
            font-size: 0.75rem;
            text-align: center;
            color: var(--vscode-descriptionForeground, #858585);
            margin-top: 20px;
        }

        .footer a {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <span class="logo-text">QRStuff Portal</span>
    </div>

    <div class="card">
        <div class="status-container">
            <span class="status-dot"></span>
            <strong>MCP Server: Active & Connected</strong>
        </div>
        <div class="description">
            The QRStuff MCP server provides your local AI agent (like Cursor Chat or Copilot) with direct tools to generate QR codes, inspect templates, and analyze scan metrics.
        </div>
    </div>

    <div class="card">
        <strong>Manual Configuration</strong>
        <div class="description">
            If your IDE settings did not register automatically, click the button below to inject the configuration into Cursor, Antigravity, and Gemini settings files.
        </div>
        <button class="btn" onclick="configure()">Configure MCP Servers</button>
    </div>

    <div class="card">
        <strong>Account Integration</strong>
        <div class="description">
            Manage your templates, designs, and subscription features. Log in to your QRStuff dashboard.
        </div>
        <button class="btn btn-secondary" onclick="openUrl('https://www.qrstuff.com/')">Open Dashboard</button>
    </div>

    <div class="footer">
        Powered by <a href="#" onclick="openUrl('https://mcp.qrstuff.ai')">QRStuff MCP Platform</a>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function configure() {
            vscode.postMessage({ type: 'configure' });
        }

        function openUrl(url) {
            vscode.postMessage({ type: 'openUrl', url: url });
        }
    </script>
</body>
</html>`;
    }
}
