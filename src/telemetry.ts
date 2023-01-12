/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import * as vscode from 'vscode';
import * as opener from 'opener';
import TelemetryReporter from '@microsoft/ads-extension-telemetry';
import { ErrorAction, ErrorHandler, Message, CloseAction } from 'vscode-languageclient';
import * as Utils from './utils';
import * as Constants from './constants';

const packageJson = require('../package.json');

export interface ITelemetryEventProperties {
	[key: string]: string;
}

export interface ITelemetryEventMeasures {
	[key: string]: number;
}

export class Telemetry {
	private static reporter: TelemetryReporter;
	private static disabled: boolean;

	/**
	 * Disable telemetry reporting
	 */
	public static disable(): void {
		this.disabled = true;
	}

	/**
	 * Initialize the telemetry reporter for use.
	 */
	public static initialize(): void {
		if (typeof this.reporter === 'undefined') {
			// Check if the user has opted out of telemetry
			if (!vscode.workspace.getConfiguration('telemetry').get<boolean>('enableTelemetry', true)) {
				this.disable();
				return;
			}

			let packageInfo = Utils.getPackageInfo(packageJson);
			this.reporter = new TelemetryReporter(packageInfo.name, packageInfo.version, packageInfo.aiKey);
		}
	}

	/**
	 * Send an Error telemetry event
	 */

	public static sendErrorTelemetry( view: string, name: string, errorcode: string, errortype: string, providername: string ): void {
		if (typeof this.disabled === 'undefined') {
			this.disabled = false;
		}

		if (this.disabled || typeof (this.reporter) === 'undefined') {
			// Don't do anything if telemetry is disabled
			return;
		}

		try {
			this.reporter.createErrorEvent(view, name, errorcode, errortype).withConnectionInfo({ providerName: providername }).send();
		} catch (telemetryErr) {
			console.log('Failed to send telemetry event. error: ' + telemetryErr)
		}
	}


	/**
	 * Send a Custom telemetry event
	 */
	public static sendTelemetryEvent( eventName: string, properties?: ITelemetryEventProperties, measures?: ITelemetryEventMeasures): void {
		if (typeof this.disabled === 'undefined') {
			this.disabled = false;
		}

		if (this.disabled || typeof (this.reporter) === 'undefined') {
			// Don't do anything if telemetry is disabled
			return;
		}

		if (!properties || typeof properties === 'undefined') {
			properties = {};
		}

		try {
			this.reporter.sendTelemetryEvent(eventName, properties, measures);
		} catch (telemetryErr) {
			console.log('Failed to send telemetry event. error: ' + telemetryErr)
		}
	}

	/**
	 * Dispose Telemetry Reporter when extension is deactivated
	 */
	public static dispose(): void {
		if ( typeof this.disable === 'undefined' || this.disable || typeof this.reporter === 'undefined' ) {
			return
		}
		this.reporter.dispose()
	}
}

/**
 * Handle Language Service client errors
 * @class LanguageClientErrorHandler
 */
export class LanguageClientErrorHandler implements ErrorHandler {

	/**
	 * Show an error message prompt with a link to known issues wiki page
	 * @memberOf LanguageClientErrorHandler
	 */
	showOnErrorPrompt(): void {
		Telemetry.sendTelemetryEvent(Constants.serviceName + 'Crash');
		vscode.window.showErrorMessage(
			Constants.serviceCrashMessage,
			Constants.serviceCrashButton).then(action => {
				if (action && action === Constants.serviceCrashButton) {
					opener(Constants.serviceCrashLink);
				}
			});
	}

	/**
	 * Callback for language service client error
	 *
	 * @param {Error} error
	 * @param {Message} message
	 * @param {number} count
	 * @returns {ErrorAction}
	 *
	 * @memberOf LanguageClientErrorHandler
	 */
	error(error: Error, message: Message, count: number): ErrorAction {
		this.showOnErrorPrompt();

		// we don't retry running the service since crashes leave the extension
		// in a bad, unrecovered state
		return ErrorAction.Shutdown;
	}

	/**
	 * Callback for language service client closed
	 *
	 * @returns {CloseAction}
	 *
	 * @memberOf LanguageClientErrorHandler
	 */
	closed(): CloseAction {
		this.showOnErrorPrompt();

		// we don't retry running the service since crashes leave the extension
		// in a bad, unrecovered state
		return CloseAction.DoNotRestart;
	}
}

Telemetry.initialize();
