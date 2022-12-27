/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
import { SqlOpsDataClient } from 'dataprotocol-client';
import { NewDatabaseDialog } from '../dialogs/newDatabaseDialog';


const localize = nls.loadMessageBundle();

const options: vscode.InputBoxOptions = {
    placeHolder: "request",
    prompt: `dbName`,
    ignoreFocusOut: true
};

export function registerDbDesignerCommands(client: SqlOpsDataClient) {

    vscode.commands.registerCommand('mySql.createDatabase', async (context: azdata.IConnectionProfile) => {
        return createNewDatabaseDialog(context, client);
    })
}

async function createNewDatabaseDialog(profile: azdata.IConnectionProfile, client: SqlOpsDataClient) {
    let newDatabaseDialog = new NewDatabaseDialog(profile, client);
    await newDatabaseDialog.openDialog();
    return newDatabaseDialog;
}