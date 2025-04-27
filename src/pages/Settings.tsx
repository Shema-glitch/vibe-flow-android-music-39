
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { useFileSystem } from "@/hooks/useFileSystem";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { AlertCircle } from "lucide-react";
import { Capacitor } from '@capacitor/core';

const Settings = () => {
  const { isScanning, scanProgress, scanMusicFiles } = useFileSystem();
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
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>Scan for music files</span>
                <Button 
                  onClick={handleScanLibrary} 
                  size="sm" 
                  disabled={isScanning}
                >
                  {isScanning ? "Scanning..." : "Scan Now"}
                </Button>
              </div>
              
              {isNative && (
                <div className="text-xs text-amber-500 dark:text-amber-400 flex items-center gap-2 mt-1 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Make sure to grant storage permissions in your device settings</span>
                </div>
              )}
              
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
