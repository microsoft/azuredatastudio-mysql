/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from "azdata";
import { SqlOpsDataClient } from "dataprotocol-client";
import { SimpleExecuteRequest } from "dataprotocol-client/lib/protocol";

export class ToolsServiceUtils {

  private static CHARSET_QUERY = "SELECT CHARACTER_SET_NAME FROM INFORMATION_SCHEMA.CHARACTER_SETS"
  private static COLLATION_QUERY_PREFIX = "SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS WHERE CHARACTER_SET_NAME="

  public static async getCharsets(ownerUri: string, client: SqlOpsDataClient): Promise<string[]> {
    let result: azdata.SimpleExecuteResult = (await ToolsServiceUtils.runQuery(ownerUri, ToolsServiceUtils.CHARSET_QUERY, client));
    var charset = result.rows.map((row) => {return row[0].displayValue;})
    return charset;
  }

  public static async getCollations(ownerUri:string, charset: string | azdata.CategoryValue, client: SqlOpsDataClient): Promise<string[]> {
    let result: azdata.SimpleExecuteResult = (await ToolsServiceUtils.runQuery(ownerUri, ToolsServiceUtils.getCollationQuery(charset), client));
    var collation = result.rows.map((row) => {return row[0].displayValue;})
    return collation;
  }

  public static async createDatabase(dbname: string, charset: string | azdata.CategoryValue, collation: string | azdata.CategoryValue, ownerUri: string, client: SqlOpsDataClient): Promise<void> {
    await ToolsServiceUtils.runQuery(ownerUri, ToolsServiceUtils.getCreateDatabaseQuery(dbname, charset, collation), client);
  }

  public static async runQuery(ownerUri: string, queryString: string, client: SqlOpsDataClient): Promise<azdata.SimpleExecuteResult> {
    let params: azdata.SimpleExecuteParams = { ownerUri: ownerUri, queryString: queryString }
    return await client.sendRequest(SimpleExecuteRequest.type, params);
  }

  private static getCreateDatabaseQuery(dbname: string, charset: string| azdata.CategoryValue, collation: string | azdata.CategoryValue): string {
    let query = "CREATE DATABASE `" + dbname + "`";
    if (charset) {
      query += " CHARACTER SET='" + charset + "'";
      if (collation) {
        query += " COLLATE='" + collation + "'";
      }
    }
    return query;
  }

  private static getCollationQuery(charset: string | azdata.CategoryValue): string {
    return this.COLLATION_QUERY_PREFIX + "'" + charset + "'";
  }
}

