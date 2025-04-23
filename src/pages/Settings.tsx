
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const handleScanLibrary = () => {
    toast({
      title: "Scanning library",
      description: "Your music is being indexed...",
    });
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
            <div className="flex justify-between items-center">
              <span>Auto-scan for new music</span>
              <Button onClick={handleScanLibrary} size="sm">Scan Now</Button>
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
              <div className="w-10 h-5 bg-primary/20 rounded-full relative p-1 cursor-pointer">
                <div className="absolute w-3 h-3 bg-primary rounded-full right-1"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Animations</span>
              <div className="w-10 h-5 bg-primary rounded-full relative p-1 cursor-pointer">
                <div className="absolute w-3 h-3 bg-white rounded-full right-1"></div>
              </div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
