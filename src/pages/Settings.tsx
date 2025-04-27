
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useFileSystem } from "@/hooks/useFileSystem";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { AlertCircle, Shield } from "lucide-react";
import { Capacitor } from '@capacitor/core';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Settings = () => {
  const { isScanning, scanProgress, scanMusicFiles, requestStoragePermission, permissionStatus } = useFileSystem();
  const { theme, setTheme } = useTheme();
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Check if running on native platform
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  const handleScanLibrary = async () => {
    if (isScanning) {
      toast({
        title: "Scan in progress",
        description: "Please wait for the current scan to complete."
      });
      return;
    }
    
    await scanMusicFiles();
  };

  const handleRequestPermissions = async () => {
    const granted = await requestStoragePermission();
    if (granted) {
      toast({
        title: "Permission granted",
        description: "Storage permission has been granted. You can now scan for music files."
      });
    }
  };

  const isDarkMode = theme === 'dark';
  const isSystemMode = theme === 'system';

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const toggleSystemTheme = () => {
    setTheme(isSystemMode ? (isDarkMode ? 'dark' : 'light') : 'system');
  };

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Library</CardTitle>
            <CardDescription>Manage your music library settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isNative && (
              <>
                {permissionStatus === 'denied' && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Permission Required</AlertTitle>
                    <AlertDescription>
                      Storage permission is required to scan for music files. Please grant the permission.
                      <div className="mt-2">
                        <Button 
                          onClick={handleRequestPermissions}
                          size="sm" 
                          variant="outline"
                        >
                          Request Permission
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {permissionStatus !== 'denied' && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-amber-500" />
                      <h3 className="font-medium text-amber-700 dark:text-amber-400">Storage Permissions Required</h3>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                      This app needs permission to access your storage to scan for music files.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRequestPermissions}
                      className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900"
                    >
                      Request Storage Permission
                    </Button>
                  </div>
                )}
              </>
            )}
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>Scan for music files</span>
                <Button 
                  onClick={handleScanLibrary} 
                  size="sm" 
                  disabled={isScanning || (isNative && permissionStatus === 'denied')}
                >
                  {isScanning ? "Scanning..." : "Scan Now"}
                </Button>
              </div>
              
              {isScanning && (
                <div className="space-y-2">
                  <Progress value={scanProgress.completedPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Scanned: {scanProgress.scannedFiles} / {scanProgress.totalFiles} files</span>
                    <span>{scanProgress.completedPercentage}% complete</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Dark Mode</span>
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={toggleDarkMode} 
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span>Use System Theme</span>
              <Switch 
                checked={isSystemMode} 
                onCheckedChange={toggleSystemTheme} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>App information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">VibeFlow v1.0.0</p>
            <p className="text-xs text-muted-foreground mt-1">Created with Lovable</p>
            {isNative && <p className="text-xs text-muted-foreground mt-1">Running on {Capacitor.getPlatform()}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
