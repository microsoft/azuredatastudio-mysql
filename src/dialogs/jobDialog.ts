/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from 'vscode-nls';
import * as azdata from 'azdata';
import { JobData } from '../data/jobData';

import { AgentDialog } from './agentDialog';

const localize = nls.loadMessageBundle();

export class JobDialog extends AgentDialog<JobData>  {

	// TODO: localize
	// Top level
	private static readonly CreateDialogTitle: string = localize('jobDialog.newJob', "New Job");
	private static readonly EditDialogTitle: string = localize('jobDialog.editJob', "Edit Job");
	private readonly GeneralTabText: string = localize('jobDialog.general', "General");
	private readonly StepsTabText: string = localize('jobDialog.steps', "Steps");
	private readonly SchedulesTabText: string = localize('jobDialog.schedules', "Schedules");
	private readonly AlertsTabText: string = localize('jobDialog.alerts', "Alerts");
	private readonly NotificationsTabText: string = localize('jobDialog.notifications', "Notifications");
	private readonly BlankJobNameErrorText: string = localize('jobDialog.blankJobNameError', "The name of the job cannot be blank.");

	// General tab strings
	private readonly NameTextBoxLabel: string = localize('jobDialog.name', "Name");
	private readonly OwnerTextBoxLabel: string = localize('jobDialog.owner', "Owner");
	private readonly CategoryDropdownLabel: string = localize('jobDialog.category', "Category");
	private readonly DescriptionTextBoxLabel: string = localize('jobDialog.description', "Description");
	private readonly EnabledCheckboxLabel: string = localize('jobDialog.enabled', "Enabled");

	// Steps tab strings
	private readonly JobStepsTopLabelString: string = localize('jobDialog.jobStepList', "Job step list");
	private readonly StepsTable_StepColumnString: string = localize('jobDialog.step', "Step");
	private readonly StepsTable_NameColumnString: string = localize('jobDialog.name', "Name");
	private readonly StepsTable_TypeColumnString: string = localize('jobDialog.type', "Type");
	private readonly StepsTable_SuccessColumnString: string = localize('jobDialog.onSuccess', "On Success");
	private readonly StepsTable_FailureColumnString: string = localize('jobDialog.onFailure', "On Failure");
	private readonly NewStepButtonString: string = localize('jobDialog.new', "New Step");
	private readonly EditStepButtonString: string = localize('jobDialog.edit', "Edit Step");
	private readonly DeleteStepButtonString: string = localize('jobDialog.delete', "Delete Step");
	private readonly MoveStepUpButtonString: string = localize('jobDialog.moveUp', "Move Step Up");
	private readonly MoveStepDownButtonString: string = localize('jobDialog.moveDown', "Move Step Down");
	private readonly StartStepDropdownString: string = localize('jobDialog.startStepAt', "Start step");

	// Notifications tab strings
	private readonly NotificationsTabTopLabelString: string = localize('jobDialog.notificationsTabTop', "Actions to perform when the job completes");
	private readonly EmailCheckBoxString: string = localize('jobDialog.email', "Email");
	private readonly PagerCheckBoxString: string = localize('jobDialog.page', "Page");
	private readonly EventLogCheckBoxString: string = localize('jobDialog.eventLogCheckBoxLabel', "Write to the Windows Application event log");
	private readonly DeleteJobCheckBoxString: string = localize('jobDialog.deleteJobLabel', "Automatically delete job");

	// Schedules tab strings
	private readonly SchedulesTopLabelString: string = localize('jobDialog.schedulesaLabel', "Schedules list");
	private readonly PickScheduleButtonString: string = localize('jobDialog.pickSchedule', "Pick Schedule");
	private readonly RemoveScheduleButtonString: string = localize('jobDialog.removeSchedule', "Remove Schedule");

	// Alerts tab strings
	private readonly AlertsTopLabelString: string = localize('jobDialog.alertsList', "Alerts list");
	private readonly NewAlertButtonString: string = localize('jobDialog.newAlert', "New Alert");
	private readonly AlertNameLabelString: string = localize('jobDialog.alertNameLabel', "Alert Name");
	private readonly AlertEnabledLabelString: string = localize('jobDialog.alertEnabledLabel', "Enabled");
	private readonly AlertTypeLabelString: string = localize('jobDialog.alertTypeLabel', "Type");

	// Event Name strings
	private readonly NewJobDialogEvent: string = 'NewJobDialogOpened';
	private readonly EditJobDialogEvent: string = 'EditJobDialogOpened';

	// UI Components
	private generalTab: azdata.window.DialogTab;
	private stepsTab: azdata.window.DialogTab;
	private alertsTab: azdata.window.DialogTab;
	private schedulesTab: azdata.window.DialogTab;
	private notificationsTab: azdata.window.DialogTab;

	// General tab controls
	private nameTextBox: azdata.InputBoxComponent;
	private ownerTextBox: azdata.InputBoxComponent;
	private categoryDropdown: azdata.DropDownComponent;
	private descriptionTextBox: azdata.InputBoxComponent;
	private enabledCheckBox: azdata.CheckBoxComponent;

	// Steps tab controls
	private stepsTable: azdata.TableComponent;
	private newStepButton: azdata.ButtonComponent;
	private moveStepUpButton: azdata.ButtonComponent;
	private moveStepDownButton: azdata.ButtonComponent;
	private editStepButton: azdata.ButtonComponent;
	private deleteStepButton: azdata.ButtonComponent;

	// Schedule tab controls
	private removeScheduleButton: azdata.ButtonComponent;

	// Notifications tab controls
	private emailCheckBox: azdata.CheckBoxComponent;
	private emailOperatorDropdown: azdata.DropDownComponent;
	private emailConditionDropdown: azdata.DropDownComponent;
	private pagerCheckBox: azdata.CheckBoxComponent;
	private pagerOperatorDropdown: azdata.DropDownComponent;
	private pagerConditionDropdown: azdata.DropDownComponent;
	private eventLogCheckBox: azdata.CheckBoxComponent;
	private eventLogConditionDropdown: azdata.DropDownComponent;
	private deleteJobCheckBox: azdata.CheckBoxComponent;
	private deleteJobConditionDropdown: azdata.DropDownComponent;
	private startStepDropdown: azdata.DropDownComponent;

	// Schedule tab controls
	private schedulesTable: azdata.TableComponent;
	private pickScheduleButton: azdata.ButtonComponent;

	// Alert tab controls
	private alertsTable: azdata.TableComponent;
	private newAlertButton: azdata.ButtonComponent;
	private isEdit: boolean = false;

	// Job objects
	private steps: azdata.AgentJobStepInfo[];
	private schedules: azdata.AgentJobScheduleInfo[];
	private alerts: azdata.AgentAlertInfo[] = [];
	private startStepDropdownValues: azdata.CategoryValue[] = [];

	constructor(ownerUri: string, jobInfo: azdata.AgentJobInfo = undefined) {
		super(
			ownerUri,
			new JobData(ownerUri, jobInfo),
			jobInfo ? JobDialog.EditDialogTitle : JobDialog.CreateDialogTitle);
		this.steps = this.model.jobSteps ? this.model.jobSteps : [];
		this.schedules = this.model.jobSchedules ? this.model.jobSchedules : [];
		this.alerts = this.model.alerts ? this.model.alerts : [];
		this.isEdit = jobInfo ? true : false;
		this.dialogName = this.isEdit ? this.EditJobDialogEvent : this.NewJobDialogEvent;
	}

	protected async initializeDialog() {
		this.generalTab = azdata.window.createTab(this.GeneralTabText);
		this.stepsTab = azdata.window.createTab(this.StepsTabText);
		this.alertsTab = azdata.window.createTab(this.AlertsTabText);
		this.schedulesTab = azdata.window.createTab(this.SchedulesTabText);
		this.notificationsTab = azdata.window.createTab(this.NotificationsTabText);
		this.initializeGeneralTab();
		this.dialog.content = [this.generalTab, this.stepsTab, this.schedulesTab, this.alertsTab, this.notificationsTab];
		this.dialog.registerCloseValidator(() => {
			this.updateModel();
			let validationResult = this.model.validate();
			if (!validationResult.valid) {
				// TODO: Show Error Messages
				console.error(validationResult.errorMessages.join(','));
			}

			return validationResult.valid;
		});
	}

	private initializeGeneralTab() {
		this.generalTab.registerContent(async view => {
			this.nameTextBox = view.modelBuilder.inputBox().component();
			this.nameTextBox.required = true;
			this.nameTextBox.onTextChanged(() => {
				if (this.nameTextBox.value && this.nameTextBox.value.length > 0) {
					this.dialog.message = null;
					// Change the job name immediately since steps
					// depends on the job name
					this.model.name = this.nameTextBox.value;
				}
			});
			this.ownerTextBox = view.modelBuilder.inputBox().component();
			this.categoryDropdown = view.modelBuilder.dropDown().component();
			let formModel = view.modelBuilder.formContainer()
				.withFormItems([{
					component: this.nameTextBox,
					title: this.NameTextBoxLabel
				}, {
					component: this.ownerTextBox,
					title: this.OwnerTextBoxLabel
				}, {
					component: this.categoryDropdown,
					title: this.CategoryDropdownLabel
				}, {
					component: this.descriptionTextBox,
					title: this.DescriptionTextBoxLabel
				}, {
					component: this.enabledCheckBox,
					title: ''
				}]).withLayout({ width: '100%' }).component();

			await view.initializeModel(formModel);

			this.nameTextBox.value = this.model.name;
			this.ownerTextBox.value = this.model.owner;
			this.categoryDropdown.values = this.model.jobCategories;

			let idx: number = undefined;
			if (this.model.category && this.model.category !== '') {
				idx = this.model.jobCategories.indexOf(this.model.category);
			}
			this.categoryDropdown.value = this.model.jobCategories[idx > 0 ? idx : 0];

			this.enabledCheckBox.checked = this.model.enabled;
			this.descriptionTextBox.value = this.model.description;
		});
	}




	protected async updateModel(): Promise<void> {
		this.model.name = this.nameTextBox.value;
		this.model.owner = this.ownerTextBox.value;
		this.model.enabled = this.enabledCheckBox.checked;
		this.model.description = this.descriptionTextBox.value;
		this.model.category = this.getDropdownValue(this.categoryDropdown);
		this.model.emailLevel = this.getActualConditionValue(this.emailCheckBox, this.emailConditionDropdown);
		this.model.operatorToEmail = this.getDropdownValue(this.emailOperatorDropdown);
		this.model.operatorToPage = this.getDropdownValue(this.pagerOperatorDropdown);
		this.model.pageLevel = this.getActualConditionValue(this.pagerCheckBox, this.pagerConditionDropdown);
		this.model.eventLogLevel = this.getActualConditionValue(this.eventLogCheckBox, this.eventLogConditionDropdown);
		this.model.deleteLevel = this.getActualConditionValue(this.deleteJobCheckBox, this.deleteJobConditionDropdown);
		this.model.startStepId = this.startStepDropdown.enabled ? +this.getDropdownValue(this.startStepDropdown) : 1;
		if (!this.model.jobSteps) {
			this.model.jobSteps = [];
		}
		this.model.jobSteps = this.steps;
		// Change the last step's success action to quit because the
		// default is "Go To Next Step"
		if (this.model.jobSteps.length > 0) {
			this.model.jobSteps[this.model.jobSteps.length - 1].successAction = azdata.StepCompletionAction.QuitWithSuccess;
		}
		if (!this.model.jobSchedules) {
			this.model.jobSchedules = [];
		}
		this.model.jobSchedules = this.schedules;
		if (!this.model.alerts) {
			this.model.alerts = [];
		}
		this.model.alerts = this.alerts;
		this.model.categoryId = +this.model.jobCategoryIdsMap.find(cat => cat.name === this.model.category).id;
	}
}
