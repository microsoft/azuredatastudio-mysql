var gulp = require('gulp');
var fs = require('fs');
var cproc = require('child_process');
var del = require('del');
var path = require('path');
var serviceDownloader = require('@microsoft/ads-service-downloader');


function getServiceInstallConfig() {
    return require('../out/utils').getServiceInstallConfig();
}

function getResolvedServiceInstallationPath(runtime) {
    return require('../out/utils').getResolvedServiceInstallationPath(runtime);
}

async function installService(runtime) {
    const config = getServiceInstallConfig();
    const serverdownloader = new serviceDownloader.ServiceDownloadProvider(config);

    return serverdownloader.installService(runtime)
}

async function getOrDownloadServer() {
    const config = getServiceInstallConfig();
    const serverdownloader = new serviceDownloader.ServerProvider(config);

    return serverdownloader.getOrDownloadServer()
}

gulp.task('ext:install-service', () => {
    return getOrDownloadServer();
});

function doPackageSync(packageName) {
    var vsceArgs = [];
    vsceArgs.push('vsce');
    vsceArgs.push('package'); // package command
    vsceArgs.push('--yarn'); // to use yarn list instead on npm list

    if (packageName !== undefined) {
        vsceArgs.push('-o');
        vsceArgs.push(packageName);
    }
    var command = vsceArgs.join(' ');
    console.log(command);
    return cproc.execSync(command);
}

function cleanServiceInstallFolder() {
    return new Promise((resolve, reject) => {
       const config = getServiceInstallConfig();
       let root = path.join(__dirname, '../out/' + 'ossdbtoolsservice');
        console.log('Deleting Service Install folder: ' + root);
        del(root + '/*').then(() => {
            resolve();
        }).catch((error) => {
            reject(error)
        });
    });
}

function doOfflinePackage(runtimeId, runtime, packageName) {
    return installService(runtime).then(() => {
       return doPackageSync(packageName + '-' + runtimeId + '.vsix');
    });
}

//Install vsce to be able to run this task: npm install -g vsce
gulp.task('package:online', () => {
    return cleanServiceInstallFolder().then(() => {
         doPackageSync();
         return getOrDownloadServer();
    });
});

//Install vsce to be able to run this task: npm install -g vsce
gulp.task('package:offline', () => {
    var json = JSON.parse(fs.readFileSync('package.json'));
    var name = json.name;
    var version = json.version;
    var packageName = name + '-' + version;

    var packages = [];
    packages.push({rid: 'win-x64', runtime: 'Windows_64'});
    packages.push({rid: 'osx', runtime: 'OSX'});
    packages.push({rid: 'linux-x64', runtime: 'Linux'});
    packages.push({rid: 'ubuntu22-x64', runtime: "Ubuntu_22"})
    packages.push({rid: 'osx-arm64', runtime: "OSX_ARM64"})

    var promise = Promise.resolve();
    cleanServiceInstallFolder().then(() => {
            packages.forEach(data => {
              promise = promise.then(() => {
                 return doOfflinePackage(data.rid, data.runtime, packageName).then(() => {
                        return cleanServiceInstallFolder();
                 });
              });
           });
    });

    return promise;
});
