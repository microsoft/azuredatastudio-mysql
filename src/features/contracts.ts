/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import { NotificationType, RequestType } from "vscode-languageclient";
import * as telemetry from '@microsoft/ads-extension-telemetry';


// ------------------------------- < Telemetry Feature Events > ------------------------------------

/**
 * Event sent when the language service send a telemetry event
 */

export namespace TelemetryNotification {
    export const type = new NotificationType<TelemetryParams, void>('telemetry/mysqlevent');
}

/**
 * Update event parameters
 */

export class TelemetryParams {
    public params!: {
        eventName: string;
        properties: telemetry.TelemetryEventProperties;
        measures: telemetry.TelemetryEventMeasures;
    }
}
// ------------------------------- </ Telemetry Feature Events > ------------------------------------

// ------------------------------- < Firewall Rule Feature Events > ------------------------------------

/**
 * A request to open up a firewall rule
 */
export namespace CreateFirewallRuleRequest {
	export const type = new RequestType<CreateFirewallRuleParams, azdata.CreateFirewallRuleResponse, void, void>('resource/createFirewallRule');
}

/**
 * Firewall rule request handler
 */
export namespace HandleFirewallRuleRequest {
	export const type = new RequestType<HandleFirewallRuleParams, azdata.HandleFirewallRuleResponse, void, void>('resource/handleFirewallRule');
}

/**
 * Firewall rule creation parameters
 */
export interface CreateFirewallRuleParams {
	/**
	 * Account information to use in connecting to Azure
	 */
	account: azdata.Account;
	/**
	 * Fully qualified name of the server to create a new firewall rule on
	 */
	serverName: string;
	/**
	 * Start of the IP address range
	 */
	startIpAddress: string;
	/**
	 * End of the IP address range
	 */
	endIpAddress: string;
	/**
	 * Firewall rule name
	 */
	firewallRuleName: string;
	/**
	 * Per-tenant token mappings. Ideally would be set independently of this call,
	 * but for now this allows us to get the tokens necessary to find a server and open a firewall rule
	 */
	securityTokenMappings: {};
}

/**
 * Firewall rule handling parameters
 */
export interface HandleFirewallRuleParams {
	/**
	 * The error code used to defined the error type
	 */
	errorCode: number;
	/**
	 * The error message from which to parse the IP address
	 */
	errorMessage: string;
	/**
	 * The connection type, for example MSSQL
	 */
	connectionTypeId: string;
}

// ------------------------------- </ Firewall Rule Feature Events > ------------------------------------
