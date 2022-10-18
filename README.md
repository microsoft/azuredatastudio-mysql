# MySQL extension for Azure Data Studio (preview)

Connect to, query, and manage MySQL databases with Azure Data Studio, a modern data editor available for Linux, MacOS, and Windows. This extension (preview) enables you to interact with MySQL using Azure Data Studio features like:

* Connect to MySQL anywhere (on-premises, or VMs, on managed MySQL in other clouds or on Azure Database for MySQL - Flexible Server)
* Searchable object explorer view for database objects, with auto-completion
* Query authoring and editing with Intellisense, syntax highlighting and code snippets
* View query results and save to csv, JSON, xml, or Excel
* Integrated terminal for Bash, PowerShell, and cmd.exe
* Source control integration with Git
* Customize dashboards and insight widgets using SQL
* Server groups for organizing connections
* Customizable keyboard shortcuts, multi-tab support, color theme options

See our [quickstart] for a step-by-step guide to get started with MySQL using Azure Data Studio.

![Connection Dialog]

## Install the MySQL extension (preview)

If you don't already have Azure Data Studio installed, see its [install instructions](https://learn.microsoft.com/sql/azure-data-studio/download-azure-data-studio).

1. Select the extensions icon from the sidebar in Azure Data Studio.

2. Search for the **MySQL** and select it.

3. Select **Install**. Once installed, select **Reload** to activate the extension in Azure Data Studio.

**Note**: The extension is currently available in [Azure Data Studio (ADS) insider build](https://learn.microsoft.com/sql/azure-data-studio/download-azure-data-studio#download-the-insiders-build-of-azure-data-studio) only. It will be available in the next ADS stable build soon.

## Offline Installation

The extension will download and install a required MySQL Tools Service package during activation. For machines with no Internet access, you can still use the extension by choosing the
`Install from VSIX...` option in the Extension view and installing a bundled release from our [Releases] page.
Each operating system has a .vsix file with the required service included. Pick the file for your OS, download and install to get started.
We recommend you choose a full release and ignore any alpha or beta releases as these are our daily builds used in testing.

## Support

Support for this extension is provided on our [GitHub Issue Tracker]. You can submit a [bug report], a [feature suggestion] or participate in discussions.

## Contributing to the Extension

See the [developer documentation] for details on how to contribute to this extension.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct]. For more information see the [Code of Conduct FAQ] or contact [opencode@microsoft.com] with any additional questions or comments.

## Privacy Statement

The [Microsoft Enterprise and Developer Privacy Statement] describes the privacy statement of this software.

## License

This extension is [licensed under the MIT License]. Please see the [third-party notices] file for additional copyright notices and license terms applicable to portions of the software.

[quickstart]: /documentation/quickstart.md
[extension manager icon]:https://user-images.githubusercontent.com/20936410/88838718-d0640b00-d18e-11ea-9f63-226c8acd030e.png
[Releases]: https://github.com/Microsoft/azuredatastudio-mysql/releases
[GitHub Issue Tracker]:https://github.com/Microsoft/azuredatastudio-mysql/issues
[bug report]:https://github.com/Microsoft/azuredatastudio-mysql/issues/new?labels=bug
[feature suggestion]:https://github.com/Microsoft/azuredatastudio-mysql/issues/new?labels=feature-request
[developer documentation]:/documentation/developer_documentation.md
[Microsoft Enterprise and Developer Privacy Statement]:https://go.microsoft.com/fwlink/?LinkId=786907&lang=en7
[licensed under the MIT License]: https://github.com/Microsoft/azuredatastudio-mysql/blob/master/LICENSE
[third-party notices]: https://github.com/Microsoft/azuredatastudio-mysql/blob/master/ThirdPartyNotices.txt
[Microsoft Open Source Code of Conduct]:https://opensource.microsoft.com/codeofconduct/
[Code of Conduct FAQ]:https://opensource.microsoft.com/codeofconduct/faq/
[opencode@microsoft.com]:mailto:opencode@microsoft.com

[Connection Dialog]:https://user-images.githubusercontent.com/102506628/193454179-2aa2c9c6-808a-4ef3-a00f-1500cae5037d.png
