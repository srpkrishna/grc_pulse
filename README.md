> Work in progress

##	1. Install brew: ##
	`ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

##	2. Install Node.js with brew: ##
	`brew install node`

##	3. Install Git:##
	http://git-scm.com/download/mac

##	4. Install Android Studio:##
	http://developer.android.com/sdk/index.html

##	5. Add ANDROID_HOME to PATH:##
	From home directory type `vi .bash_profile` and add this `export PATH=<path_to_android_sdk>/platform-tools:<path_to_android_sdk>/tools:$PATH`

##	6. Install ARM & Intel system images using SDK Manager:##
	`android`

##	7. Create Android Virtual Device:##
	`android avd`

##	8. Install iOS Simulator##
	Make sure Xcode is installed and all T&C are accepted at its first launch.
	`brew install ios-sim`

##	9. Install Cordova##
	`sudo npm install -g cordova`

##	10. Create Cordova app##
	`cordova create GRC_Pulse`
	`cordova platform add android`
	`cordova platform add ios`
	`cordova platform add windows`

##	11. Install forcedroid##
	`sudo npm install forcedroid -g`

##	12. Create forcedroid app:##
	{????}

##	13. Install forceios##
	`sudo  npm install forceios -g`

##	14. Create forceios app##
	{????}

##  15. Plugin details
    #following plugins need to be added for this project
    cordova-plugin-device 1.1.2 "Device"
    cordova-plugin-dialogs 1.2.1 "Notification"
    cordova-plugin-file 4.1.1 "File"
    cordova-plugin-file-transfer 1.5.1 "File Transfer"
    cordova-plugin-inappbrowser 1.2.1 "InAppBrowser"
    cordova-plugin-network-information 1.2.1 "Network Information"
    cordova-plugin-statusbar 2.1.3 "StatusBar"
    cordova-plugin-whitelist 1.2.2 "Whitelist"
    cordova-plugin-x-toast 2.5.1 "Toast"
    cordova-sqlite-storage 1.4.1 "Cordova sqlite storage plugin"
    de.sitewaerts.cordova.documentviewer 0.2.0 "SitewaertsDocumentViewer"
    ionic-plugin-keyboard 2.2.0 "Keyboard"
    phonegap-plugin-push 1.6.3 "PushPlugin"

    how to add push plugin
    cordova plugin add https://github.com/phonegap/phonegap-plugin-push --variable SENDER_ID="343201725359"

		cordova plugin add cordova-fabric-plugin --variable FABRIC_API_KEY=f7757b574b91f1a340fe196ca6413e7c71fb1461 --variable FABRIC_API_SECRET=e36436cf01eb29760ba44584a78a095ab741f6ec4b48ac2c95f09cfe97642a50

##  16. To compile JSX file
        jsx --watch /jsxViews/ /www/appViews/ --extension jsx --no-cache-dir
*To be continued…*

env variables

export ANDROID_HOME=/Users/asinha/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
export ANT_HOME=/Users/asinha/softwares/apache-ant-1.9.6
export PATH=$ANT_HOME/bin:$PATH
export SALESFORCE_SDK_DIR=/Users/asinha/git/SalesforceMobileSDK-Android
export PATH=$SALESFORCE_SDK_DIR:$PATH
export NATIVE_DIR=$SALESFORCE_SDK_DIR/native
export PATH=$NATIVE_DIR:$PATH
export HYBRID_DIR=$SALESFORCE_SDK_DIR/hybrid
export PATH=$HYBRID_DIR:$PATH
export LIBS_DIR=$SALESFORCE_SDK_DIR/libs
export PATH=$LIBS_DIR:$PATH

forcedroid create --apptype=hybrid_local --appname=GRC_Pulse --targetdir=/Users/asinha/git/grc_pulse_hybrid --packagename=com.metricstream.grcpulse

code signing password is : makethisapp2016
mater password is : makethisapp2016

removing application from adb
adb uninstall com.metricstream.grcpulse


https://github.com/developerforce/Force.com-JavaScript-REST-Toolkit

"testsfdc:///mobilesdk/detect/oauth/done#
access_token=00D61000000YvHe!AQUAQNAwKfHggEPQav8_mEr1GB_K0tAYfltSI4a4fzjVWFSl1CAfYwmJXTl3Gy3bOFnEsupffeDg4pvhhOAwOINcN4zdTKxB
&refresh_token=5Aep861tbt360sO1.s7vtGNETIEaon7XD_jEioOaE8O1z38zNIBbokkVNTd.JduijtgQrfjp0hWUB1f9edVSWpx
&instance_url=https://pulseapp-dev-ed.my.salesforce.com
&id=https://login.salesforce.com/id/00D61000000YvHeEAK/00561000000SoeLAAS
&issued_at=1464068488533
&signature=T+MCDNCb4lEp/mOUEfdvQlb+5KqDliTXtyd0knjspYw=
&scope=id+api+web+full+chatter_api+visualforce+refresh_token+openid+custom_permissions+wave_api
&token_type=Bearer"

Code Signing Details for Android:
Keystore password: grcpulse

Alias: grc
Alias password: grcpulse

Validity: 100 years
First Last name: MetricStream
Organization unit: AEG
Organization: MetricStream
City / Locality: Bangalore
State / Province: Karnataka
Country Code: IN

Ashish Intellij master password: 123

Type: release
