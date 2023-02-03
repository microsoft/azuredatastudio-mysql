/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SqlOpsDataClient } from 'dataprotocol-client';
import { NewDatabaseDialog } from '../dialogs/newDatabaseDialog';

export function registerDbDesignerCommands(client: SqlOpsDataClient) {

    vscode.commands.registerCommand('mySql.createDatabase', async () => {
        return createNewDatabaseDialog(client);
    })
}

async function createNewDatabaseDialog(client: SqlOpsDataClient) {
    let newDatabaseDialog = new NewDatabaseDialog(client);
    await newDatabaseDialog.openDialog();
    return newDatabaseDialog;
}