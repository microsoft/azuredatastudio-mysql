/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NotificationType } from "vscode-languageclient";
import * as telemetry from '@microsoft/ads-extension-telemetry';


// ------------------------------- < Telemetry Sent Event > ------------------------------------

/**
 * Event sent when the language service send a telemetry event
 */

export namespace TelemetryErrorNotification {
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
// ------------------------------- </ Telemetry Sent Event > ------------------------------------

