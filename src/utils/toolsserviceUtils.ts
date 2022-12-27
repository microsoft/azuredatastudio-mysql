/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from "azdata";
import { SqlOpsDataClient } from "dataprotocol-client";
import { SimpleExecuteRequest } from "dataprotocol-client/lib/protocol";

export class ToolsServiceUtils {

  public static async runQuery(ownerUri: string, queryString: string, client: SqlOpsDataClient): Promise<azdata.SimpleExecuteResult> {
    let params: azdata.SimpleExecuteParams = { ownerUri: ownerUri, queryString: queryString }
    return await client.sendRequest(SimpleExecuteRequest.type, params);
  }

}