# Quickstart: Use Azure Data Studio to connect and query MySQL

This quickstart shows how to use Azure Data Studio to connect to MySQL, and then use SQL statements to create the database *tutorialdb* and query it.

## Prerequisites

To complete this quickstart, you need Azure Data Studio and access to a MySQL server.

- [Install Azure Data Studio]
- [Install MySQL]. (Alternatively, you can create a MySQL database in the cloud using [az mysql up]).

## Install the MySQL extension for Azure Data Studio
1. Select the Extensions Icon to view the available extensions.
![extension manager icon]

2. Search for the **MySQL** extension and select it to view its details. Click **Install** to add the extension.

3. Once installed, **Reload** to enable the extension in Azure Data Studio (only required when installing an extension for the first time).

## Connect to MySQL

1. Start **Azure Data Studio**.

2. The first time you start Azure Data Studio the **Connection** dialog opens. If the **Connection** dialog doesn't open, click the **New Connection** icon on the **Servers** view in the **Connections** tab:

   ![New Connection Icon]

3. In the dialog that pops up, go to **Connection type** and select **MySQL** from the drop-down.


4. Fill in the remaining fields to authenticate using:
   1) **SQL Login**: Select **Password** in the 'Authentication type' dropdown. Provide the server name, user name, and password for your MySQL server.
   2) **Azure Active Directory**: Select **Azure Active Directory** in the 'Authentication type' dropdown. Provide the server name, user name, and your Microsoft account

   ![New Connection Screen]

   | Setting       | Example value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   | **Server name** | localhost | The fully qualified server name |
   | **Authentication Type** | Password | Choice of logging into server with SQL Login (Password) or Azure Active Directory |
   | **User name** | mysql | The user name you want to log in with. |
   | **Password (SQL Login)** | *password* | The password for the account you are logging in with. |
   | **Password** | *Check* | Check this box if you don't want to enter the password each time you connect. |
   | **Account (AAD Login)** | user@microsoft.com | The Microsoft account you are logging in with. |
   | **Database name** | \<Default\> | Fill this if you want the connection to specify a database. |
   | **Server group** | \<Default\> | This option lets you assign this connection to a specific server group you create. |
   | **Name (optional)** | *leave blank* | This option lets you specify a friendly name for your server. |

5. Select **Connect**.

After successfully connecting, your server opens in the **SERVERS** sidebar.


## Create a database

The following steps create a database named **tutorialdb**:

1. Right-click on your MySQL server in the **SERVERS** sidebar and select **New Query**.

2. Paste this SQL statement in the query editor that opens up.

   ```sql
   CREATE DATABASE tutorialdb;
   ```

3. From the toolbar select **Run** to execute the query. Notifications appear in the **MESSAGES** pane to show query progress.

>[!TIP]
> You can use **F5** on your keyboard to execute the statement instead of using **Run**.

After the query completes, right-click **Databases** and select **Refresh** to see **tutorialdb** in the list under the **Databases** node.


## Create a table

 The following steps create a table in the **tutorialdb**:

1. Change the connection context to **tutorialdb** using the drop-down in the query editor.

   ![Change context]

2. Paste the following SQL statement into the query editor and click **Run**.

   > [!NOTE]
   > You can either append this or overwrite the existing query in the editor. Clicking **Run** executes only the query that is highlighted. If nothing is highlighted, clicking **Run** executes all queries in the editor.

   ```sql
   -- Drop the table if it already exists
   DROP TABLE IF EXISTS customers;
   -- Create a new table called 'customers'
   CREATE TABLE customers(
       customer_id SERIAL PRIMARY KEY,
       name VARCHAR (50) NOT NULL,
       location VARCHAR (50) NOT NULL,
       email VARCHAR (50) NOT NULL
   );
   ```

## Insert rows

Paste the following snippet into the query window and click **Run**:

   ```sql
   -- Insert rows into table 'customers'
   INSERT INTO customers
       (customer_id, name, location, email)
    VALUES
      ( 1, 'Orlando', 'Australia', ''),
      ( 2, 'Keith', 'India', 'keith0@adventure-works.com'),
      ( 3, 'Donna', 'Germany', 'donna0@adventure-works.com'),
      ( 4, 'Janet', 'United States','janet1@adventure-works.com');
   ```

## Query the data

1. Paste the following snippet into the query editor and click **Run**:

   ```sql
   -- Select rows from table 'customers'
   SELECT * FROM customers;
   ```

2. The results of the query are displayed:

   ![View results]

## Next Steps

Learn about the [scenarios available] for MySQL in Azure Data Studio.

[Install Azure Data Studio]:https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio
[Install MySQL]:https://dev.mysql.com/downloads/installer/
[az mysql up]: https://docs.microsoft.com/en-us/azure/mysql/quickstart-create-server-up-azure-cli
[scenarios available]:../README.md

[extension manager icon]:https://user-images.githubusercontent.com/20936410/88838718-d0640b00-d18e-11ea-9f63-226c8acd030e.png
[New Connection Icon]:https://user-images.githubusercontent.com/20936410/88839725-49b02d80-d190-11ea-8d51-5d57e551e888.png
[New Connection Screen]:https://user-images.githubusercontent.com/20936410/88841636-1327e200-d193-11ea-969b-0e0c977c6467.PNG
[Change Context]:https://user-images.githubusercontent.com/20936410/88843628-4ddf4980-d196-11ea-8ad0-485bda63cc06.png
[View Results]:https://user-images.githubusercontent.com/20936410/88843661-5afc3880-d196-11ea-892f-6f9f662f455a.png