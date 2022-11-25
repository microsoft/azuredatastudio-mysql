/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AppContext } from '../appContext';
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';

const localize = nls.loadMessageBundle();

const options: vscode.InputBoxOptions = {
    placeHolder: "request",
    prompt: `dbName`,
    ignoreFocusOut: true
};
export function registerDbDesignerCommands(appContext: AppContext) {

    vscode.commands.registerCommand('mySql.createDatabase', async () => {
        const dbName = await vscode.window.showInputBox({
			prompt: 'dbName',
			ignoreFocusOut: true,
			validateInput(value) {
				    if (!value) {
					return undefined;
				}
				const error = localize('validdbName', "Please enter a valid database name");
				try {
					const databaseName = value.trim();
					if (databaseName !== 'testdb') {
						return error;
					}
				} catch (e) {
					return error;
				}
				return undefined;
			}
		});
		let query = `BEGIN TRY
			CREATE DATABASE ${dbName}
			SELECT 1 AS NoError
		END TRY
		BEGIN CATCH
			SELECT ERROR_MESSAGE() AS ErrorMessage;
		END CATCH`;
	})
	// appContext.extensionContext.subscriptions.push(vscode.commands.registerCommand('mySql.createDatabase', async () => {
    //     const dbName =  await vscode.window.showInputBox({
	// 		prompt: 'dbName',
	// 		ignoreFocusOut: true,
	// 		validateInput(value) {
	// 			if (!value) {
	// 				return undefined;
	// 			}
	// 			const error = localize('validdbName', "Please enter a valid database name");
	// 			try {
	// 				const databaseName = value.trim();
	// 				if (databaseName !== 'testdb') {
	// 					return error;
	// 				}
	// 			} catch (e) {
	// 				return error;
	// 			}
	// 			return undefined;
	// 		}
	// 	});
	// }));
}

