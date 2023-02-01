/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from "azdata";
import { SqlOpsDataClient } from "dataprotocol-client";
import { SimpleExecuteRequest } from "dataprotocol-client/lib/protocol";
import { CreateDatabaseRequest, GetCharsetsRequest, GetCollationsRequest } from "../contracts/contracts";
import { CreateDatabaseRequestParams, GetCharsetsRequestParams, GetCharsetsResponse, GetCollationsRequestParams, GetCollationsResponse } from "../models/newDatabaseModels";

export class ToolsServiceUtils {

  public static async getCharsets(ownerUri: string, client: SqlOpsDataClient): Promise<string[]> {
    let params: GetCharsetsRequestParams = {ownerUri: ownerUri};
    let result: GetCharsetsResponse = (await client.sendRequest(GetCharsetsRequest.type, params));
    return result.charsets;
  }

  public static async getCollations(ownerUri:string, charset: string | azdata.CategoryValue, client: SqlOpsDataClient): Promise<string[]> {
    let charsetvalue = (typeof charset === 'string') ? charset : charset.name;
    let params: GetCollationsRequestParams = {ownerUri: ownerUri, charset: charsetvalue};
    let result: GetCollationsResponse = (await client.sendRequest(GetCollationsRequest.type, params));
    return result.collations;
  }

  public static async createDatabase(dbname: string, charset: string | azdata.CategoryValue, collation: string | azdata.CategoryValue, ownerUri: string, client: SqlOpsDataClient): Promise<void> {
    let charsetvalue = (typeof charset === 'string') ? charset : charset.name;
    let collationvalue = (typeof collation === 'string') ? collation : collation.name;
    let params: CreateDatabaseRequestParams = {ownerUri: ownerUri, dbName: dbname, charset: charsetvalue, collation: collationvalue};
    await client.sendRequest(CreateDatabaseRequest.type, params);
  }

  public static async runQuery(ownerUri: string, queryString: string, client: SqlOpsDataClient): Promise<azdata.SimpleExecuteResult> {
    let params: azdata.SimpleExecuteParams = { ownerUri: ownerUri, queryString: queryString }
    return await client.sendRequest(SimpleExecuteRequest.type, params);
  }
}

