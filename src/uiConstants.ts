/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as nls from 'vscode-nls';
const localize = nls.loadMessageBundle()

export const NewDatabaseTitle = localize('newDatabaseTitle', 'New Database');
export const NewDatabaseDialogName = localize('newDatabaseDialogName', 'newDatabaseDialog')
export const CreateButtonLabel = localize('createButtonLabel', 'Create')
export const CancelButtonLabel = localize('cancelButtonLabel', 'Cancel')
export const NewDatabaseDetailsTitle = localize('newDatabaseDetailsTitle', 'New Database Details')
export const DatabaseNameTextBoxLabel = localize('databaseNameTextBoxLabel', 'Database Name TextBox')
export const DatabaseNameTextBoxPlaceHolder = localize('newDatabaseNameTextBoxPlaceHolder', 'Enter New Database Name')
export const DatabaseNameLabel = localize('databaseNameLabel', 'Name')
export const DatabaseCharsetDropDownLabel = localize('databaseCharsetDropDownLabel', 'Database Charset Dropdown')
export const DatabaseCharsetLabel = localize('databaseCharsetLabel', 'Charset')
export const DatabaseCollationDropDownLabel = localize('databaseCollationDropDownLabel', 'Database Collation Dropdown')
export const DatabaseCollationLabel = localize('databaseCollationLabel', 'Collation')