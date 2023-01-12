import { NotificationType } from "vscode-languageclient";
import { ITelemetryEventMeasures, ITelemetryEventProperties } from "../telemetry";

// ------------------------------- < Telemetry Sent Event > ------------------------------------
export namespace TelemetryNotification {
    export const errorType = new NotificationType<TelemetryErrorParams, void>('telemetry/mysqlerrortelemetry');
}

export class TelemetryErrorParams {
    public params: {
        view: string;
        action: string;
        errorCode: string;
        errorType: string;
        providerName: string
    }
}
// ------------------------------- </ Telemetry Sent Event > ------------------------------------

