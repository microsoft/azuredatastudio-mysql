/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import * as nls from 'vscode-nls';
const localize = nls.config({ messageFormat: nls.MessageFormat.file })();
import { SqlOpsDataClient, ClientOptions } from 'dataprotocol-client';
import { IConfig, ServerProvider, Events } from '@microsoft/ads-service-downloader';
import { ServerOptions, TransportKind } from 'vscode-languageclient';

import * as Constants from './constants';
import ContextProvider from './contextProvider';
import * as Utils from './utils';
import { TelemetryReporter, LanguageClientErrorHandler } from './telemetry';
import { TelemetryFeature } from './features/telemetry';
import { registerDbDesignerCommands } from './features/dbDesigner';
import { FireWallFeature } from './features/firewall'

const baseConfig = require('./config.json');
const outputChannel = vscode.window.createOutputChannel(Constants.serviceName);
const statusView = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

export async function activate(context: vscode.ExtensionContext) {

	// lets make sure we support this platform first
	let supported = await Utils.verifyPlatform();

	if (!supported) {
		vscode.window.showErrorMessage(localize('unsupportedPlatformMsg', "Unsupported platform"));
		return;
	}

	let config: IConfig = JSON.parse(JSON.stringify(baseConfig));
	config.installDirectory = path.join(__dirname, config.installDirectory);
	config.proxy = vscode.workspace.getConfiguration('http').get('proxy');
	config.strictSSL = vscode.workspace.getConfiguration('http').get('proxyStrictSSL') || true;

	let languageClient: SqlOpsDataClient;

	const serverdownloader = new ServerProvider(config);

	serverdownloader.eventEmitter.onAny(generateHandleServerProviderEvent());

	let clientOptions: ClientOptions = {
		providerId: Constants.providerId,
		errorHandler: new LanguageClientErrorHandler(),
		documentSelector: ['sql'],
		synchronize: {
			configurationSection: Constants.providerId
		},
		features: [
			// we only want to add new features
			...SqlOpsDataClient.defaultFeatures,
			TelemetryFeature,
			FireWallFeature
		],
	};

	const installationStart = Date.now();
	serverdownloader.getOrDownloadServer().then(e => {
		const installationComplete = Date.now();
		let serverOptions = generateServerOptions(e);
		languageClient = new SqlOpsDataClient(Constants.serviceName, serverOptions, clientOptions);
		const processStart = Date.now();
		languageClient.onReady().then(() => {
			const processEnd = Date.now();
			statusView.text = localize('serviceStartedStatusMsg', "{0} service started", Constants.providerId);
			setTimeout(() => {
				statusView.hide();
			}, 1500);
			TelemetryReporter.sendTelemetryEvent('startup/LanguageClientStarted', {
				installationTime: String(installationComplete - installationStart),
				processStartupTime: String(processEnd - processStart),
				totalTime: String(processEnd - installationStart),
				beginningTimestamp: String(installationStart)
			});
		});
		statusView.show();
		statusView.text = localize('startingServiceStatusMsg', "Starting {0} service", Constants.providerId);
    registerDbDesignerCommands(languageClient);
		languageClient.start();
	}, e => {
		TelemetryReporter.sendTelemetryEvent('ServiceInitializingFailed');
		vscode.window.showErrorMessage(localize('failedToStartServiceErrorMsg', "Failed to start {0} tools service", Constants.providerId));
	});

	let contextProvider = new ContextProvider();
	context.subscriptions.push(contextProvider);
	context.subscriptions.push(TelemetryReporter);
	context.subscriptions.push({ dispose: () => languageClient.stop() });
}

function generateServerOptions(executablePath: string): ServerOptions {
	let serverArgs = [];
	let serverCommand: string = executablePath;

	let config = vscode.workspace.getConfiguration(Constants.providerId);
	if (config) {
		// Override the server path with the local debug path if enabled

		let useLocalSource = config["useDebugSource"];
		if (useLocalSource) {
			let localSourcePath = config["debugSourcePath"];
			let filePath = path.join(localSourcePath, "ossdbtoolsservice/ossdbtoolsservice_main.py");
			process.env.PYTHONPATH = localSourcePath;
			serverCommand = process.platform === 'win32' ? 'python' : 'python3';

			let enableStartupDebugging = config["enableStartupDebugging"];
			let debuggingArg = enableStartupDebugging ? '--enable-remote-debugging-wait' : '--enable-remote-debugging';
			let debugPort = config["debugServerPort"];
			debuggingArg += '=' + debugPort;
			serverArgs = [filePath, debuggingArg];
		}

		let logFileLocation = path.join(Utils.getDefaultLogLocation(), Constants.providerId);

		serverArgs.push('--log-dir=' + logFileLocation);
		serverArgs.push(logFileLocation);

		// Enable diagnostic logging in the service if it is configured
		let logDebugInfo = config["logDebugInfo"];
		if (logDebugInfo) {
			serverArgs.push('--enable-logging');
		}
	}

	serverArgs.push('provider=' + Constants.providerId);
	// run the service host
	return { command: serverCommand, args: serverArgs, transport: TransportKind.stdio };
}

function generateHandleServerProviderEvent() {
	let dots = 0;
	return (e: string, ...args: any[]) => {
		outputChannel.show();
		statusView.show();
		switch (e) {
			case Events.INSTALL_START:
				outputChannel.appendLine(localize('installingServiceChannelMsg', "Installing {0} to {1}", Constants.serviceName, args[0]));
				statusView.text = localize('installingServiceStatusMsg', "Installing {0}", Constants.serviceName);
				break;
			case Events.INSTALL_END:
				outputChannel.appendLine(localize('installedServiceChannelMsg', "Installed {0}", Constants.serviceName));
				break;
			case Events.DOWNLOAD_START:
				outputChannel.appendLine(localize('downloadingServiceChannelMsg', "Downloading {0}", args[0]));
				outputChannel.append(localize('downloadingServiceSizeChannelMsg', "({0} KB)", Math.ceil(args[1] / 1024).toLocaleString(vscode.env.language)));
				statusView.text = localize('downloadingServiceStatusMsg', "Downloading {0}", Constants.serviceName);
				break;
			case Events.DOWNLOAD_PROGRESS:
				let newDots = Math.ceil(args[0] / 5);
				if (newDots > dots) {
					outputChannel.append('.'.repeat(newDots - dots));
					dots = newDots;
				}
				break;
			case Events.DOWNLOAD_END:
				outputChannel.appendLine(localize('downloadServiceDoneChannelMsg', "Done!"));
				break;
		}
	};
}

// this method is called when your extension is deactivated
export function deactivate(): void {
}
