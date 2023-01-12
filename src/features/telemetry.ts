import { SqlOpsDataClient } from "dataprotocol-client";
import { ClientCapabilities, StaticFeature } from "vscode-languageclient";
import * as Utils from '../utils';
import * as contracts from './contracts';
import { Telemetry } from "../telemetry";

export class TelemetryFeature implements StaticFeature {

    constructor(private _client: SqlOpsDataClient) { }

    fillClientCapabilities(capabilities: ClientCapabilities): void {
        Utils.ensure(capabilities, 'telemetry')!.telemetry = true;
    }

    initialize(): void {
        this._client.onNotification(contracts.TelemetryErrorNotification.type, e => {
            Telemetry.sendErrorTelemetry(e.params.view, e.params.name, e.params.errorCode, e.params.errorType, e.params.providerName);
        });
    }
}

