/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from "azdata";
import { SqlOpsDataClient } from "dataprotocol-client";
import { SimpleExecuteRequest } from "dataprotocol-client/lib/protocol";
import { CreateDatabaseRequest, GetCharsetsRequest, GetCollationsRequest } from "../contracts/contracts";
import { CharsetInfo, CreateDatabaseRequestParams, GetCharsetsRequestParams, GetCharsetsResponse, GetCollationsRequestParams, GetCollationsResponse } from "../models/newDatabaseModels";

export class ToolsServiceUtils {

  public static async getCharsets(ownerUri: string, client: SqlOpsDataClient): Promise<CharsetInfo[]> {
    let params: GetCharsetsRequestParams = {ownerUri: ownerUri};
    let result: GetCharsetsResponse = (await client.sendRequest(GetCharsetsRequest.type, params));
    return result.charsets;
  }

  public static async getCollations(ownerUri:string, charset: string, client: SqlOpsDataClient): Promise<string[]> {
    let params: GetCollationsRequestParams = {ownerUri: ownerUri, charset: charset};
    let result: GetCollationsResponse = (await client.sendRequest(GetCollationsRequest.type, params));
    return result.collations;
  }

  public static async createDatabase(dbname: string, charset: string, collation: string, ownerUri: string, client: SqlOpsDataClient): Promise<void> {
    let params: CreateDatabaseRequestParams = {ownerUri: ownerUri, dbName: dbname, charset: charset, collation: collation};
    await client.sendRequest(CreateDatabaseRequest.type, params);
  }

  public static async runQuery(ownerUri: string, queryString: string, client: SqlOpsDataClient): Promise<azdata.SimpleExecuteResult> {
    let params: azdata.SimpleExecuteParams = { ownerUri: ownerUri, queryString: queryString }
    return await client.sendRequest(SimpleExecuteRequest.type, params);
  }
}

