import { NotificationType } from "vscode-languageclient";

// ------------------------------- < Telemetry Sent Event > ------------------------------------
export namespace TelemetryErrorNotification {
    export const type = new NotificationType<TelemetryErrorParams, void>('telemetry/mysqlerror');
}

export class TelemetryErrorParams {
    public params: {
        view: string;
        name: string;
        errorCode: string;
        errorType: string;
        providerName: string
    }
}
// ------------------------------- </ Telemetry Sent Event > ------------------------------------

