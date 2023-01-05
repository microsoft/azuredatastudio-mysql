import { NotificationType } from "vscode-languageclient";
import { ITelemetryEventMeasures, ITelemetryEventProperties } from "./telemetry";



// ------------------------------- < Telemetry Sent Event > ------------------------------------
export namespace TelemetryNotification {
    export const type = new NotificationType<TelemetryParams, void>('telemetry/errorevent');
}

export class TelemetryParams {
    public params: {
        eventName: string;
        properties: ITelemetryEventProperties;
        measures: ITelemetryEventMeasures;
    }
}
// ------------------------------- </ Telemetry Sent Event > ------------------------------------

