/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as azdata from 'azdata';
import { SqlOpsDataClient } from 'dataprotocol-client';
import * as vscode from 'vscode';
import { CharsetInfo } from '../models/newDatabaseModels';
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
	private DEFAULT_CHARSET_VALUE = "utf8";
	private DEFAULT_COLLATION_VALUE = "utf8_general_ci"
	private charsetsCache: string[] = [];
	private defaultCollationCache: Map<string, string> = new Map<string, string>();
	private collationsCache: Map<string, string[]> =  new Map<string, string[]>();

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
		await this.tryUpdateCollationDropDown(this.DEFAULT_CHARSET_VALUE);
	}

	private onLoadingComplete(): void {
		this.databaseNameTextBox.enabled = true;
		this.databaseCharsetDropDown.loading = false;
		this.databaseCharsetDropDown.enabled = true;
		this.databaseCollationDropDown.loading = false;
		this.databaseCollationDropDown.enabled = true;
	}

	private async loadConnectionOwnerUri(): Promise<void> {
		var connid = (await azdata.connection.getCurrentConnection()).connectionId;
		this.connectionOwnerUri = (await azdata.connection.getUriForConnection(connid));
	}

	private async loadAndUpdateCharsetValues(): Promise<void> {
		try {
			var charsets: CharsetInfo[] = await ToolsServiceUtils.getCharsets(this.connectionOwnerUri, this.client);
			charsets.forEach(charset => {
				this.charsetsCache.push(charset.name);
				this.defaultCollationCache.set(charset.name, charset.defaultCollation);
			});
			this.databaseCharsetDropDown.values = this.charsetsCache;
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
			values: [this.DEFAULT_CHARSET_VALUE],
			value: this.DEFAULT_CHARSET_VALUE,
			ariaLabel: DatabaseCharsetDropDownLabel,
			required: false,
			width: '310px',
			enabled: false,
			loading: true
		}).component();

		this.databaseCharsetDropDown.onValueChanged(() => {
			this.tryUpdateCollationDropDown(this.getCurrentCharset());
		});

		const databaseCharsetLabel = view.modelBuilder.text().withProps({
			value: DatabaseCharsetLabel,
			requiredIndicator: false,
			width: '110px'
		}).component();

		const databaseCharsetRow = view.modelBuilder.flexContainer().withItems([databaseCharsetLabel, <azdata.DropDownComponent>this.databaseCharsetDropDown], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-top': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();

		return databaseCharsetRow;
	}

	private async getCollationValues(charset: string): Promise<string[]> {
		let collationValues = [this.defaultCollationCache.get(charset)];
		try {
			if (!this.collationsCache.has(charset)) {
				let collations = await ToolsServiceUtils.getCollations(this.connectionOwnerUri, charset, this.client);
				this.collationsCache.set(charset, collations);
			}
			collationValues = this.collationsCache.get(charset);
		}
		catch (e) {
			// Log the error message and keep the values of collation value as default.
			console.warn("New Database Tab : Unable to fetch collation values. Using default collation.")
		}
		return collationValues;
	}

	private createDatabaseCollationRow(view: azdata.ModelView): azdata.FlexContainer {
		this.databaseCollationDropDown = view.modelBuilder.dropDown().withProps({
			values: [this.DEFAULT_COLLATION_VALUE],
			value: this.DEFAULT_COLLATION_VALUE,
			ariaLabel: DatabaseCollationDropDownLabel,
			required: false,
			width: '310px',
			enabled: false,
			loading: true
		}).component();

		const databaseCollationLabel = view.modelBuilder.text().withProps({
			value: DatabaseCollationLabel,
			requiredIndicator: false,
			width: '110px'
		}).component();

		const databaseCharsetRow = view.modelBuilder.flexContainer().withItems([databaseCollationLabel, <azdata.DropDownComponent>this.databaseCollationDropDown], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-top': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();

		return databaseCharsetRow;
	}

	private async tryUpdateCollationDropDown(charset_name: string): Promise<void> {
		this.databaseCollationDropDown.loading = true;
		this.databaseCollationDropDown.value = this.defaultCollationCache.get(charset_name);
		this.databaseCollationDropDown.values = (await this.getCollationValues(charset_name));
		this.databaseCollationDropDown.loading = false;
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
				this.getCurrentCharset(),
				this.getCurrentCollation(),
				this.connectionOwnerUri,
				this.client);
			return true;
		}
		catch (e) {
			this.showErrorMessage(e.message)
		}
		return false;
	}

	private getCurrentCharset(): string {
		let charset = this.databaseCharsetDropDown.value;
		let charsetValue = (typeof charset === 'string') ? charset : charset.name;
		return charsetValue;
	}

	private getCurrentCollation(): string {
		let collation = this.databaseCollationDropDown.value;
		let collationValue = (typeof collation === 'string') ? collation : collation.name;
		return collationValue;
	}

	protected showErrorMessage(message: string): void {
		this.dialog.message = {
			text: message,
			level: azdata.window.MessageLevel.Error
		};
	}
}
