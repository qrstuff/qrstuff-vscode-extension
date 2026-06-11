import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { QRStuffWebviewProvider } from './webviewProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('QRStuff MCP Helper Extension is now active.');

    // 1. Register Webview Sidebar Provider
    const provider = new QRStuffWebviewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'qrstuff.webview',
            provider
        )
    );

    // 2. Perform Automatic MCP Configuration on Startup
    try {
        configureMCPServers(false);
    } catch (err) {
        console.error('Failed to auto-configure MCP servers on startup:', err);
    }

    // 3. Register Manual Configuration Command
    const configureCommand = vscode.commands.registerCommand('qrstuff.configureMCP', () => {
        try {
            configureMCPServers(true);
        } catch (err: any) {
            vscode.window.showErrorMessage(`Failed to configure MCP servers: ${err.message}`);
        }
    });
    context.subscriptions.push(configureCommand);
}

export function deactivate() {}

/**
 * Automatically detects and registers the QRStuff MCP server in Cursor, Antigravity, and Gemini CLI configurations.
 * @param manual True if triggered by a user action, false if run silently on startup.
 */
function configureMCPServers(manual: boolean) {
    const homedir = os.homedir();
    const serverConfig = {
        url: "https://mcp.qrstuff.ai/mcp"
    };

    let configuredCount = 0;
    let messages: string[] = [];

    // Configuration targets
    const targets = [
        {
            name: 'Cursor',
            dirPath: path.join(homedir, '.cursor'),
            filePath: path.join(homedir, '.cursor', 'mcp.json'),
            key: 'mcpServers'
        },
        {
            name: 'Antigravity',
            dirPath: path.join(homedir, '.gemini', 'antigravity'),
            filePath: path.join(homedir, '.gemini', 'antigravity', 'mcp_config.json'),
            key: 'mcpServers'
        },
        {
            name: 'Gemini CLI',
            dirPath: path.join(homedir, '.gemini'),
            filePath: path.join(homedir, '.gemini', 'settings.json'),
            key: 'mcpServers'
        }
    ];

    for (const target of targets) {
        // Only write to target if its parent directory exists (indicating the tool is installed/used)
        if (fs.existsSync(target.dirPath)) {
            try {
                let config: any = {};
                
                if (fs.existsSync(target.filePath)) {
                    const fileContent = fs.readFileSync(target.filePath, 'utf-8').trim();
                    if (fileContent) {
                        try {
                            config = JSON.parse(fileContent);
                        } catch (e) {
                            console.warn(`Could not parse JSON for ${target.name} config, overwriting...`);
                        }
                    }
                }

                // Ensure the mcpServers parent key exists
                if (!config[target.key] || typeof config[target.key] !== 'object') {
                    config[target.key] = {};
                }

                // Inject or update QRStuff server configuration
                config[target.key]['qrstuff'] = serverConfig;

                // Write back formatted JSON
                fs.writeFileSync(target.filePath, JSON.stringify(config, null, 2), 'utf-8');
                configuredCount++;
                messages.push(`${target.name} config file`);
                console.log(`Successfully registered QRStuff MCP server in ${target.name} configuration.`);
            } catch (err: any) {
                console.error(`Error configuring ${target.name} MCP server:`, err);
                if (manual) {
                    throw new Error(`Error writing ${target.name} configuration: ${err.message}`);
                }
            }
        }
    }

    if (manual) {
        if (configuredCount > 0) {
            vscode.window.showInformationMessage(
                `QRStuff MCP Server configured successfully in: ${messages.join(', ')}.`
            );
        } else {
            vscode.window.showWarningMessage(
                "No target IDE configuration directories were found. Please make sure Cursor or Gemini CLI is installed."
            );
        }
    }
}
