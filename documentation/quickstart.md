# Quickstart: Use Azure Data Studio to connect and query MySQL (Preview)

This quickstart shows how to use Azure Data Studio to connect to a MySQL server (hosted on-premises, on VMs, on managed MySQL in other clouds or on Azure Database for MySQL - FLexible Server), create a database, and use SQL statements to insert and query data in the database.

## Prerequisites

To complete this quickstart, you need Azure Data Studio, the MySQL extension for Azure Data Studio, and access to a MySQL server.

- [Install Azure Data Studio](https://learn.microsoft.com/sql/azure-data-studio/download-azure-data-studio).
- A MySQL server. You can either create a managed MySQL server on Azure using [Azure Database for MySQL - Flexible Server](https://learn.microsoft.com/azure/mysql/flexible-server/quickstart-create-server-portal.md) or [install MySQL locally](https://dev.mysql.com/downloads/mysql/).

## Install the MySQL extension for Azure Data Studio (preview)

1. Select the extensions icon from the sidebar in Azure Data Studio.

   ![extension manager icon]

2. Search for the **MySQL** extension and select it.

3. Select **Install** to add the extension. Once installed, select **Reload** to enable the extension in Azure Data Studio (only required when installing an extension for the first time).

**Note**: The extension is currently available in Azure Data Studio insider build only. To use the extension with Azure Data Studio general availability (GA) release, follow the [Offline Installation] instructions.

## Connect to MySQL

1. Start **Azure Data Studio**.

2. The first time you start Azure Data Studio the **Connection** dialog opens. If the **Connection** dialog doesn't open, click the **New Connection** icon on the **Servers** view in the **Connections** tab:

   ![New Connection Icon]

3. In the dialog window that pops up, go to **Connection type** and select **MySQL** from the drop-down.

4. Enter your MySQL server name, user name, and password for authentication:

   ![New Connection Screen]

   | Setting       | Example value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   | **Server name** | localhost / exampleserver.mysql.database.azure.con | The fully qualified server name. |
   | **User name** | mysqluser | The user name you want to log in with. |
   | **Password (SQL Login)** | *password* | The password for the user account you are logging in with. |
   | **Remember Password** | *Check* | Check this box if you don't want to enter the password each time you connect. |
   | **Database name** | \<Default\> | Enter a database name if you want the connection to specify a database. |
   | **Server group** | \<Default\> | This option lets you assign this connection to a specific server group you create. |
   | **Name (optional)** | *leave blank* | This option lets you specify a friendly name for your server. |

5. If your MySQL server requires SSL encryptions, navigate to **Advanced Properties** window by selecting **Advanced...** button, enter the SSL configuration details and select **OK**. By default, SSL mode is configured as *Require*. For more details on SSL encryption and modes, see [Configuring MySQL to Use Encrypted Connections](https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html).

6. Review the connection details and select **Connect**.

Once a successful connection is established, your server opens in the **SERVERS** sidebar.

## Create a database

The following steps will create a database named **tutorialdb**:

1. Right-click on your MySQL server in the **SERVERS** sidebar and select **New Query**.

2. Paste this SQL statement in the query editor that opens up.

   ```sql
   CREATE DATABASE tutorialdb;
   ```

3. From the toolbar select **Run** to execute the query. Notifications appear in the **MESSAGES** pane to show query progress.

>[!TIP]
> You can use **F5** on your keyboard to execute the statement instead of using **Run**.

fter the query completes, right-click **Databases** under your MySQL server in the **SERVERS** sidebar, and select **Refresh** to see **tutorialdb** listed under the **Databases** node.

## Create a table

 The following steps will create a table in the **tutorialdb**:

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

## Insert data

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

## Query data

1. Paste the following snippet into the query editor and select **Run**:

   ```sql
   -- Select rows from table 'customers'
   SELECT * FROM customers;
   ```

2. The results of the query are displayed:

   ![View results]

Alternatively, in the **SERVERS** sidebar, navigate down to the **customers** table, right-click on the table and select **Select Top 1000** to query the data.

## Next Steps

Learn about the [scenarios available] for MySQL in Azure Data Studio.

[scenarios available]:../README.md
[Offline Installation]:../README.md#Offline-Installation

[extension manager icon]:https://user-images.githubusercontent.com/20936410/88838718-d0640b00-d18e-11ea-9f63-226c8acd030e.png
[New Connection Icon]:https://user-images.githubusercontent.com/20936410/88839725-49b02d80-d190-11ea-8d51-5d57e551e888.png
[New Connection Screen]:https://user-images.githubusercontent.com/102506628/193454179-2aa2c9c6-808a-4ef3-a00f-1500cae5037d.png
[Change Context]:https://user-images.githubusercontent.com/102506628/193454241-d50169e6-88a6-4874-b78f-de9f3fd21b71.PNG
[View Results]:https://user-images.githubusercontent.com/102506628/193454261-aaed735f-0fb6-4f2d-b494-33923fac99d0.PNG
