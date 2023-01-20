/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as azdata from 'azdata';
import { SqlOpsDataClient } from 'dataprotocol-client';
import * as vscode from 'vscode';
import { CancelButtonLabel, CreateButtonLabel, DatabaseCharsetDropDownLabel, DatabaseCharsetLabel, DatabaseCollationDropDownLabel, DatabaseCollationLabel, DatabaseNameLabel, DatabaseNameTextBoxLabel, DatabaseNameTextBoxPlaceHolder, NewDatabaseDetailsTitle, NewDatabaseDialogName, NewDatabaseTitle } from '../uiConstants';
import { Deferred } from '../utils/PromiseUtils';
import { ToolsServiceUtils } from '../utils/toolsserviceUtils';

export class NewDatabaseDialog {
	public dialog: azdata.window.Dialog;
	public newDatabaseTab: azdata.window.DialogTab;
	public databaseNameTextBox: azdata.InputBoxComponent | undefined;
	public databaseCharsetDropDown: azdata.DropDownComponent | undefined;
	public databaseCollationDropDown: azdata.DropDownComponent | undefined;
	private connectionOwnerUri: string;
	private client: SqlOpsDataClient;
	private formBuilder: azdata.FormBuilder | undefined;
	private toDispose: vscode.Disposable[] = [];
	private initDialogComplete: Deferred = new Deferred();
	private DEFAULT_CHARSET: string = "Default Charset";
	private DEFAULT_COLLATION: string = "Default Collation"

	constructor(client: SqlOpsDataClient) {
		this.client = client;
		this.dialog = azdata.window.createModelViewDialog(NewDatabaseTitle, NewDatabaseDialogName);
		this.newDatabaseTab = azdata.window.createTab('');
		this.dialog.registerCloseValidator(async () => {
			return this.executeAndValidate();
		});
	}

	public async openDialog(): Promise<void> {
		this.initializeDialog();
		this.dialog.okButton.label = CreateButtonLabel;
		this.dialog.okButton.enabled = false;
		this.toDispose.push(this.dialog.okButton.onClick(async () => await this.handleCreateButtonClick()));

		this.dialog.cancelButton.label = CancelButtonLabel;

		azdata.window.openDialog(this.dialog);
		await this.initDialogComplete.promise;
		await this.loadDialogData();
		this.onLoadingComplete();
	}

	private async loadDialogData(): Promise<void> {
		await this.loadConnectionOwnerUri();
		await this.loadAndUpdateCharsetValues();
	}

	private onLoadingComplete(): void {
		this.databaseCharsetDropDown.loading = false;
		this.databaseNameTextBox.enabled = true;
		this.databaseCharsetDropDown.enabled = true;
	}

	private async loadConnectionOwnerUri(): Promise<void> {
		var connid = (await azdata.connection.getCurrentConnection()).connectionId;
		this.connectionOwnerUri = (await azdata.connection.getUriForConnection(connid));
	}

	private async loadAndUpdateCharsetValues(): Promise<void> {
		try {
			var charsetValues = [this.DEFAULT_CHARSET];
			this.databaseCharsetDropDown.values = charsetValues.concat(await ToolsServiceUtils.getCharsets(this.connectionOwnerUri, this.client));
		}
		catch (e) {
			// Log the error message and keep the values of charset as default.
			console.warn("New Database Tab : Unable to fetch charset values. Using default charset.")
		}
	}

	private initializeDialog(): void {
		this.initializeNewDatabaseTab();
		this.dialog.content = [this.newDatabaseTab];
	}

	private initializeNewDatabaseTab(): void {
		this.newDatabaseTab.registerContent(async view => {

			const databaseNameRow = this.createDatabaseNameRow(view);
			const databaseCharsetRow = this.createDatabaseCharsetRow(view);
			const databaseCollationRow = this.createDatabaseCollationRow(view);
			const newDatabaseDetailsFormSection = view.modelBuilder.flexContainer().withLayout({ flexFlow: 'column' }).component();
			newDatabaseDetailsFormSection.addItems([databaseNameRow, databaseCharsetRow, databaseCollationRow]);

			this.formBuilder = <azdata.FormBuilder>view.modelBuilder.formContainer()
				.withFormItems([
					{
						title: NewDatabaseDetailsTitle,
						components: [
							{
								component: newDatabaseDetailsFormSection,
							}
						]
					}
				], {
					horizontal: false,
					titleFontSize: 13
				})
				.withLayout({
					width: '100%',
					padding: '10px 10px 0 20px'
				});

			let formModel = this.formBuilder.component();
			await view.initializeModel(formModel);
			this.initDialogComplete?.resolve();
		});
	}

	private createDatabaseNameRow(view: azdata.ModelView): azdata.FlexContainer {
		this.databaseNameTextBox = view.modelBuilder.inputBox().withProps({
			ariaLabel: DatabaseNameTextBoxLabel,
			placeHolder: DatabaseNameTextBoxPlaceHolder,
			required: true,
			width: "310px",
			enabled: false
		}).component();

		this.databaseNameTextBox.onTextChanged(() => {
			this.databaseNameTextBox!.value = this.databaseNameTextBox!.value?.trim();
			void this.databaseNameTextBox!.updateProperty('title', this.databaseNameTextBox!.value);
			this.tryEnableCreateButton();
		});

		const databaseNameLabel = view.modelBuilder.text().withProps({
			value: DatabaseNameLabel,
			requiredIndicator: true,
			width: '110px'
		}).component();

		const databaseNameRow = view.modelBuilder.flexContainer().withItems([databaseNameLabel, this.databaseNameTextBox], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-top': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();

		return databaseNameRow;
	}

	private createDatabaseCharsetRow(view: azdata.ModelView): azdata.FlexContainer {
		this.databaseCharsetDropDown = view.modelBuilder.dropDown().withProps({
			values: [this.DEFAULT_CHARSET],
			value: this.DEFAULT_CHARSET,
			ariaLabel: DatabaseCharsetDropDownLabel,
			required: false,
			width: '310px',
			enabled: false,
			loading: true
		}).component();

		this.databaseCharsetDropDown.onValueChanged(() => {
			this.tryUpdateCollationDropDown(this.databaseCharsetDropDown.value);
		});

		const databaseCharsetLabel = view.modelBuilder.text().withProps({
			value: DatabaseCharsetLabel,
			requiredIndicator: false,
			width: '110px'
		}).component();

		const databaseCharsetRow = view.modelBuilder.flexContainer().withItems([databaseCharsetLabel, <azdata.DropDownComponent>this.databaseCharsetDropDown], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-top': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();

		return databaseCharsetRow;
	}

	private async getCollationValues(charset_name: string | azdata.CategoryValue): Promise<string[]> {
		let collationValues = [this.DEFAULT_COLLATION];
		try {
			collationValues = collationValues.concat(await ToolsServiceUtils.getCollations(this.connectionOwnerUri, charset_name, this.client));
		}
		catch (e) {
			// Log the error message and keep the values of collation value as default.
			console.warn("New Database Tab : Unable to fetch collation values. Using default collation.")
		}
		return collationValues;
	}

	private createDatabaseCollationRow(view: azdata.ModelView): azdata.FlexContainer {
		this.databaseCollationDropDown = view.modelBuilder.dropDown().withProps({
			values: [this.DEFAULT_COLLATION],
			value: this.DEFAULT_COLLATION,
			ariaLabel: DatabaseCollationDropDownLabel,
			required: false,
			width: '310px',
			enabled: false
		}).component();

		const databaseCollationLabel = view.modelBuilder.text().withProps({
			value: DatabaseCollationLabel,
			requiredIndicator: false,
			width: '110px'
		}).component();

		const databaseCharsetRow = view.modelBuilder.flexContainer().withItems([databaseCollationLabel, <azdata.DropDownComponent>this.databaseCollationDropDown], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-top': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();

		return databaseCharsetRow;
	}

	private async tryUpdateCollationDropDown(charset_name: string | azdata.CategoryValue): Promise<void> {
		if (this.databaseCharsetDropDown.value != this.DEFAULT_CHARSET) {
			this.databaseCollationDropDown.value = this.DEFAULT_COLLATION;
			this.databaseCollationDropDown.loading = true;
			this.databaseCollationDropDown.values = (await this.getCollationValues(charset_name));
			this.databaseCollationDropDown.loading = false;
			this.databaseCollationDropDown.enabled = true;
		}
		else {
			this.databaseCollationDropDown.enabled = false;
			this.databaseCollationDropDown.value = this.DEFAULT_COLLATION;
			this.databaseCollationDropDown.values = [this.DEFAULT_COLLATION];
		}
	}

	private tryEnableCreateButton(): void {
		this.dialog.okButton.enabled = true;
	}

	public async handleCreateButtonClick(): Promise<void> {
		this.dispose();
	}

	private dispose(): void {
		this.toDispose.forEach(disposable => disposable.dispose());
	}

	private async executeAndValidate(): Promise<boolean> {
		try {
			await ToolsServiceUtils.createDatabase(
				this.databaseNameTextBox.value,
				this.databaseCharsetDropDown.value == this.DEFAULT_CHARSET ? '' : this.databaseCharsetDropDown.value,
				this.databaseCollationDropDown.value == this.DEFAULT_COLLATION ? '' : this.databaseCollationDropDown.value,
				this.connectionOwnerUri,
				this.client);
			return true;
		}
		catch (e) {
			this.showErrorMessage(e.message)
		}
		return false;
	}

	protected showErrorMessage(message: string): void {
		this.dialog.message = {
			text: message,
			level: azdata.window.MessageLevel.Error
		};
	}
}