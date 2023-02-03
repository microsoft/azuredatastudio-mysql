/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RequestType } from 'vscode-languageclient';
import { CreateDatabaseRequestParams, GetCharsetsRequestParams, GetCharsetsResponse, GetCollationsRequestParams, GetCollationsResponse } from "../models/newDatabaseModels";

export namespace CreateDatabaseRequest {
    export const type = new RequestType<CreateDatabaseRequestParams, void, void, void>("mysqlnewdatabase/create");
}

export namespace GetCharsetsRequest {
    export const type = new RequestType<GetCharsetsRequestParams, GetCharsetsResponse, void, void>("mysqlnewdatabase/charsets");
}

export namespace GetCollationsRequest {
    export const type = new RequestType<GetCollationsRequestParams, GetCollationsResponse, void, void>("mysqlnewdatabase/collations");
}