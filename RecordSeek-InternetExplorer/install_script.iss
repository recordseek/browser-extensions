;InnoSetupVersion=5.5.0 (Unicode)

[Setup]
AppName=RecordSeek
AppVerName=RecordSeek
AppVersion=1.0.0
AppPublisher=RecordSeek
AppPublisherURL=http://recordseek.com/
DefaultDirName={pf}\RecordSeek\IE
UninstallDisplayIcon={pf}\RecordSeek\IE\icon_toolbar.ico
OutputBaseFilename=RecordSeek-IE-1.0.0
Compression=lzma2
DisableDirPage=yes
;WizardImageFile=embedded\WizardImage.bmp
;WizardSmallImageFile=embedded\WizardSmallImage.bmp

[Files]
Source: "{app}\CONTEXT_SCRIPT.htm"; DestDir: "{app}"; MinVersion: 0.0,5.0; 
Source: "{app}\FrameScript.htm"; DestDir: "{app}"; MinVersion: 0.0,5.0; 
Source: "{app}\icon_toolbar.ico"; DestDir: "{app}"; MinVersion: 0.0,5.0; 
;Source: "{app}\AutoUpdater.exe"; DestDir: "{app}"; MinVersion: 0.0,5.0; 

[Registry]
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\Extensions\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; MinVersion: 0.0,5.0; Flags: uninsdeletekey 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\Extensions\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; ValueName: "ButtonText"; ValueType: String; ValueData: "RecordSeek"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\Extensions\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; ValueName: "CLSID"; ValueType: String; ValueData: "{{1FBA04EE-3024-11D2-8F1F-0000F87ABD16}"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\Extensions\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; ValueName: "Script"; ValueType: String; ValueData: "{pf}\RecordSeek\IE\FrameScript.htm"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\Extensions\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; ValueName: "Icon"; ValueType: String; ValueData: "{pf}RecordSeek\IE\icon_toolbar.ico"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\Extensions\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; ValueName: "HotIcon"; ValueType: String; ValueData: "{pf}RecordSeek\IE\icon_toolbar.ico"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\Extensions\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; ValueName: "Default Visible"; ValueType: String; ValueData: "Yes"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\Extensions\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; ValueName: "MenuText"; ValueType: String; ValueData: "&RecordSeek"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\Extensions\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; ValueName: "ToolTip"; ValueType: String; ValueData: "RecordSeek"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\MINIE"; ValueName: "CommandBarEnabled"; ValueType: Dword; ValueData: "$1"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; MinVersion: 0.0,5.0; Flags: uninsdeletekey 
Root: HKLM; Subkey: "Software\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper Objects\{{D40C654D-7C51-4EB3-95B2-1E23905C2A2D}"; ValueName: "Alright"; ValueType: String; ValueData: "1"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\MenuExt\&RecordSeek"; MinVersion: 0.0,5.0; Flags: uninsdeletekey 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\MenuExt\&RecordSeek"; ValueType: String; ValueData: "{pf}RecordSeek\IE\FrameScript.htm"; MinVersion: 0.0,5.0; 
Root: HKLM; Subkey: "Software\Microsoft\Internet Explorer\MenuExt\&RecordSeek"; ValueName: "Contexts"; ValueType: Binary; ValueData: "02"; MinVersion: 0.0,5.0; 

;[Run]
;Filename: "schtasks.exe"; Parameters: "/Create /RU SYSTEM /SC DAILY /TN ;RecordSeekAutoUpdate /TR ""{\}""{app}\AutoUpdater.exe{\}"""" /ST 17:00 /F"; MinVersion: 0.0,5.0; 

;[UninstallRun]
;Filename: "schtasks.exe"; Parameters: "/Delete /TN RecordSeekAutoUpdate /F"; ;MinVersion: 0.0,5.0; 

[UninstallDelete]
Type: filesandordirs; Name: "{pf}\RecordSeek"; 

[CustomMessages]
default.NameAndVersion=%1 version %2
default.AdditionalIcons=Additional icons:
default.CreateDesktopIcon=Create a &desktop icon
default.CreateQuickLaunchIcon=Create a &Quick Launch icon
default.ProgramOnTheWeb=%1 on the Web
default.UninstallProgram=Uninstall %1
default.LaunchProgram=Launch %1
default.AssocFileExtension=&Associate %1 with the %2 file extension
default.AssocingFileExtension=Associating %1 with the %2 file extension...
default.AutoStartProgramGroupDescription=Startup:
default.AutoStartProgram=Automatically start %1
default.AddonHostProgramNotFound=%1 could not be located in the folder you selected.%n%nDo you want to continue anyway?

[Languages]
; These files are stubs
; To achieve better results after recompilation, use the real language files
;Name: "default"; MessagesFile: "embedded\default.isl"; 
