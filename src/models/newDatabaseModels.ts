/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface CreateDatabaseRequestParams {
    ownerUri: string,
    dbName: string,
    charset: string,
    collation: string
}

export interface GetCharsetsRequestParams {
    ownerUri: string
}

export interface GetCharsetsResponse {
    charsets: string[]
}

export interface GetCollationsRequestParams {
    ownerUri: string,
    charset: string
}

export interface GetCollationsResponse {
    collations: string[]
}