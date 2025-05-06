import { useState, useCallback, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { useHapticFeedback } from './useHapticFeedback';

// Import AndroidPermissions dynamically
let AndroidPermissions: any;
try {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    // Use dynamic import for web compatibility
    import('@awesome-cordova-plugins/android-permissions').then(module => {
      AndroidPermissions = module.AndroidPermissions;
    }).catch(error => {
      console.warn('Could not load AndroidPermissions:', error);
    });
  }
} catch (error) {
  console.warn('Could not load @awesome-cordova-plugins/android-permissions:', error);
}

export interface ScanProgress {
  totalFiles: number;
  scannedFiles: number;
  completedPercentage: number;
}

export interface MusicFile {
  id: string;
  path: string;
  name: string;
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  albumArt?: string;
  uri?: string;
  fileSize?: number;
  mimeType?: string;
}

export function useFileSystem() {
  const [isScanning, setIsScanning] = useState(false);
  const [isDeepScan, setIsDeepScan] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    totalFiles: 0,
    scannedFiles: 0,
    completedPercentage: 0
  });
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const { triggerHapticFeedback, triggerNotificationHaptic } = useHapticFeedback();

  // Check permission status on component mount
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      checkPermissionStatus();
    }
  }, []);

  const checkPermissionStatus = async () => {
    try {
      if (Capacitor.getPlatform() === 'android') {
        // Handle case where AndroidPermissions plugin is not available
        if (!AndroidPermissions) {
          console.warn("AndroidPermissions plugin is not available");
          setPermissionStatus('unknown');
          return false;
        }
        
        try {
          const storagePermission = await AndroidPermissions.checkPermission(
            AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
          );
          
          console.log("Storage permission status:", storagePermission);
          setPermissionStatus(storagePermission.hasPermission ? 'granted' : 'denied');
          return storagePermission.hasPermission;
        } catch (err) {
          console.error("Error checking permission status:", err);
          setPermissionStatus('unknown');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error in checkPermissionStatus:", error);
      setPermissionStatus('unknown');
      return false;
    }
  };

  const requestStoragePermission = useCallback(async () => {
    try {
      await triggerHapticFeedback(); // Add haptic feedback
      
      const isAndroid = Capacitor.getPlatform() === 'android';
      
      if (isAndroid) {
        console.log("Android platform detected, requesting permissions");
        
        // Gracefully handle missing AndroidPermissions plugin
        if (!AndroidPermissions) {
          console.warn("AndroidPermissions plugin is not available");
          toast({
            title: "Plugin not available",
            description: "Using fallback permission request. Please install the app properly for full functionality.",
          });
          // Use a more graceful fallback for development/testing
          setPermissionStatus('granted');
          return true;
        }
        
        try {
          // Check permission status
          const storagePermission = await AndroidPermissions.checkPermission(
            AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
          );
          
          console.log("Storage permission status:", storagePermission);
          
          if (!storagePermission.hasPermission) {
            console.log("Requesting storage permission");
            
            // Request permission from user
            const permissionResult = await AndroidPermissions.requestPermission(
              AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
            );
            
            console.log("Permission request result:", permissionResult);
            
            if (!permissionResult.hasPermission) {
              toast({
                title: "Permission denied",
                description: "Storage permission is required to scan music files. Please enable it in your device settings.",
                variant: "destructive"
              });
              await triggerNotificationHaptic(); // Add failure haptic
              setPermissionStatus('denied');
              return false;
            }
          }
          
          // For Android 13+ (API 33+), also request READ_MEDIA_AUDIO permission
          try {
            const audioPermission = await AndroidPermissions.checkPermission(
              "android.permission.READ_MEDIA_AUDIO"
            );
            
            if (!audioPermission.hasPermission) {
              const audioPermResult = await AndroidPermissions.requestPermission(
                "android.permission.READ_MEDIA_AUDIO"
              );
              
              console.log("Audio media permission result:", audioPermResult);
            }
          } catch (err) {
            // This might fail on older Android versions, which is fine
            console.log("READ_MEDIA_AUDIO check failed, likely on older Android:", err);
          }
          
          setPermissionStatus('granted');
          return true;
        } catch (err) {
          console.error("Error with AndroidPermissions:", err);
          toast({
            title: "Permission request failed",
            description: "We'll try to proceed anyway, but functionality may be limited.",
          });
          // Use a fallback for development/testing
          setPermissionStatus('granted');
          return true;
        }
      } else {
        // When running in web browser, we'll simulate permission granted
        console.log("Running in web environment, simulating permission granted");
        setPermissionStatus('granted');
        return true;
      }
      
    } catch (error) {
      console.error("Error requesting permission:", error);
      toast({
        title: "Permission error",
        description: "Failed to request storage permission. Try restarting the app.",
        variant: "destructive"
      });
      await triggerNotificationHaptic(); // Add failure haptic
      // For better UX, still allow the user to try the app with mock data
      setPermissionStatus('denied');
      return false;
    }
  }, [triggerHapticFeedback, triggerNotificationHaptic]);

  // This function performs a deep scan of the entire storage for audio files
  const deepScanMusicFiles = useCallback(async () => {
    console.log("Starting deep music file scan");
    await triggerHapticFeedback(); // Add haptic feedback on scan start
    
    // Check if we already have permission
    let hasPermission = await checkPermissionStatus();
    
    if (!hasPermission) {
      hasPermission = await requestStoragePermission();
    }
    
    if (!hasPermission) {
      console.log("No permission, stopping scan");
      return;
    }

    setIsScanning(true);
    setIsDeepScan(true);
    setScanProgress({
      totalFiles: 0,
      scannedFiles: 0,
      completedPercentage: 0
    });
    
    try {
      // In a web environment, use mock data for testing
      if (!Capacitor.isNativePlatform()) {
        // Simulate scanning with mock data
        await simulateScanWithMockData(true);
        await triggerNotificationHaptic(); // Add success haptic
        return;
      }
      
      // Start from root directory for deep scan
      const rootDirs = ['/storage/emulated/0'];
      const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
      const filesFound: MusicFile[] = [];
      
      // Track progress
      const dirsToScan: string[] = [...rootDirs];
      let scannedDirs = 0;
      let totalDirs = 1; // Start with 1 for the root, will increment as we discover subdirs
      
      while (dirsToScan.length > 0) {
        const currentDir = dirsToScan.shift(); // Get next directory
        
        if (!currentDir) continue;
        
        try {
          console.log(`Scanning directory: ${currentDir}`);
          
          // Read directory contents
          let files;
          try {
            files = await Filesystem.readdir({
              path: currentDir,
              directory: Directory.External
            });
          } catch (e) {
            console.log(`Could not read directory ${currentDir}:`, e);
            continue;
          }
          
          // Process each file/directory
          for (const file of files.files) {
            const filePath = `${currentDir}/${file.name}`;
            
            // If it's a directory, add it to the scan queue
            if (file.type === 'directory') {
              // Skip some system folders to avoid permission issues
              const skipDirs = [
                '/storage/emulated/0/Android/data',
                '/storage/emulated/0/Android/obb',
                '/storage/emulated/0/.android',
                '/storage/emulated/0/android'
              ];
              
              if (!skipDirs.some(dir => filePath.startsWith(dir))) {
                dirsToScan.push(filePath);
                totalDirs++;
              }
            } 
            // If it's a file with audio extension
            else if (file.type === 'file') {
              const fileLower = file.name.toLowerCase();
              if (audioExtensions.some(ext => fileLower.endsWith(ext))) {
                try {
                  // Get file URI
                  const fileUri = await Filesystem.getUri({
                    path: filePath,
                    directory: Directory.External
                  });
                  
                  // Extract metadata
                  const fileName = file.name;
                  const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
                  const parts = fileNameWithoutExt.split('-').map(p => p.trim());
                  
                  let artist = 'Unknown Artist';
                  let title = fileNameWithoutExt;
                  
                  if (parts.length >= 2) {
                    artist = parts[0];
                    title = parts.slice(1).join(' ');
                  }
                  
                  filesFound.push({
                    id: `file-${filesFound.length}-${Date.now()}`,
                    path: filePath,
                    name: file.name,
                    title: title,
                    artist: artist,
                    album: 'Unknown Album',
                    uri: fileUri.uri,
                    mimeType: getMimeType(fileName)
                  });
                  
                  console.log(`Found audio file: ${filePath}`);
                } catch (e) {
                  console.error(`Error processing file ${file.name}:`, e);
                }
              }
            }
          }
          
          scannedDirs++;
          
          // Update progress - show based on directories scanned vs total known directories
          setScanProgress({
            totalFiles: totalDirs, 
            scannedFiles: scannedDirs,
            completedPercentage: Math.floor((scannedDirs / totalDirs) * 100)
          });
          
        } catch (err) {
          console.error(`Error scanning directory ${currentDir}:`, err);
          scannedDirs++;
        }
      }
      
      if (filesFound.length > 0) {
        console.log(`Found ${filesFound.length} audio files on the device`);
        setMusicFiles(filesFound);
        
        toast({
          title: "Deep scan completed",
          description: `Found ${filesFound.length} music files on your device.`
        });
        await triggerNotificationHaptic(); // Add success haptic
      } else {
        console.log("No audio files found");
        toast({
          title: "No music files found",
          description: "We couldn't find any audio files on your device. Try placing some MP3 files in your storage."
        });
        await triggerNotificationHaptic(); // Add notification haptic
      }
      
    } catch (error) {
      console.error("Error in deep scan:", error);
      toast({
        title: "Scan failed",
        description: "An error occurred while scanning music files.",
        variant: "destructive"
      });
      await triggerNotificationHaptic(); // Add failure notification
    } finally {
      setIsScanning(false);
      setIsDeepScan(false);
      setScanProgress({
        totalFiles: 100,
        scannedFiles: 100,
        completedPercentage: 100
      });
    }
  }, [checkPermissionStatus, requestStoragePermission, triggerHapticFeedback, triggerNotificationHaptic]);

  // This function scans for actual music files on the device - standard scan
  const scanMusicFiles = useCallback(async () => {
    console.log("Starting music file scan");
    await triggerHapticFeedback(); // Add haptic feedback on scan start
    
    // Check if we already have permission before requesting it
    let hasPermission = await checkPermissionStatus();
    
    // If we don't have permission, request it
    if (!hasPermission) {
      hasPermission = await requestStoragePermission();
    }
    
    console.log("Permission status:", hasPermission);
    
    if (!hasPermission) {
      console.log("No permission, stopping scan");
      return;
    }

    setIsScanning(true);
    setScanProgress({
      totalFiles: 0,
      scannedFiles: 0,
      completedPercentage: 0
    });
    
    try {
      // In a web environment, use mock data for testing
      if (!Capacitor.isNativePlatform()) {
        // Simulate scanning with mock data
        await simulateScanWithMockData();
        await triggerNotificationHaptic(); // Add success haptic
        return;
      }
      
      // On Android, use the Filesystem API to scan for music files
      const filesFound: MusicFile[] = [];
      
      // Common audio directories on Android
      const directories = [
        '/storage/emulated/0/Music',
        '/storage/emulated/0/Download',
        '/storage/emulated/0/DCIM/Audio',
        '/storage/emulated/0/Android/media',
        '/storage/emulated/0/Sounds'
      ];
      
      // Audio file extensions
      const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
      
      // Search through directories recursively
      let totalDirectories = directories.length;
      let scannedDirectories = 0;
      
      for (const directory of directories) {
        try {
          let files;
          try {
            files = await Filesystem.readdir({
              path: directory,
              directory: Directory.External
            });
          } catch (e) {
            console.log(`Could not read directory ${directory}:`, e);
            scannedDirectories++;
            setScanProgress({
              totalFiles: totalDirectories,
              scannedFiles: scannedDirectories,
              completedPercentage: Math.floor((scannedDirectories / totalDirectories) * 100)
            });
            continue;
          }
          
          console.log(`Found ${files.files.length} files in ${directory}`);
          
          // Filter audio files
          for (const file of files.files) {
            if (file.type === 'file') {
              const fileLower = file.name.toLowerCase();
              if (audioExtensions.some(ext => fileLower.endsWith(ext))) {
                // This is an audio file
                const filePath = `${directory}/${file.name}`;
                console.log(`Found audio file: ${filePath}`);
                
                try {
                  // Get the file URI
                  const fileUri = await Filesystem.getUri({
                    path: filePath,
                    directory: Directory.External
                  });
                  
                  // Extract metadata from filename (basic approach)
                  // In a real app, you'd use a media library or metadata extraction
                  const fileName = file.name;
                  const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
                  const parts = fileNameWithoutExt.split('-').map(p => p.trim());
                  
                  // Try to guess artist and title from filename
                  let artist = 'Unknown Artist';
                  let title = fileNameWithoutExt;
                  
                  if (parts.length >= 2) {
                    artist = parts[0];
                    title = parts.slice(1).join(' ');
                  }
                  
                  filesFound.push({
                    id: `file-${filesFound.length}-${Date.now()}`,
                    path: filePath,
                    name: file.name,
                    title: title,
                    artist: artist,
                    album: 'Unknown Album',
                    uri: fileUri.uri,
                    mimeType: getMimeType(fileName)
                  });
                } catch (e) {
                  console.error(`Error processing file ${file.name}:`, e);
                }
              }
            }
          }
          
          scannedDirectories++;
          setScanProgress({
            totalFiles: totalDirectories,
            scannedFiles: scannedDirectories,
            completedPercentage: Math.floor((scannedDirectories / totalDirectories) * 100)
          });
        } catch (err) {
          console.error(`Error scanning directory ${directory}:`, err);
          scannedDirectories++;
          setScanProgress({
            totalFiles: totalDirectories,
            scannedFiles: scannedDirectories,
            completedPercentage: Math.floor((scannedDirectories / totalDirectories) * 100)
          });
        }
      }
      
      if (filesFound.length > 0) {
        console.log(`Found ${filesFound.length} audio files on the device`);
        setMusicFiles(filesFound);
        
        toast({
          title: "Scan completed",
          description: `Found ${filesFound.length} music files on your device.`
        });
        await triggerNotificationHaptic(); // Add success haptic
      } else {
        console.log("No audio files found");
        toast({
          title: "No music files found",
          description: "We couldn't find any audio files on your device. Try placing some MP3 files in your Music folder."
        });
        await triggerNotificationHaptic(); // Add notification haptic
      }
      
    } catch (error) {
      console.error("Error scanning files:", error);
      toast({
        title: "Scan failed",
        description: "An error occurred while scanning music files.",
        variant: "destructive"
      });
      await triggerNotificationHaptic(); // Add failure notification haptic
    } finally {
      setIsScanning(false);
      setScanProgress({
        totalFiles: 100,
        scannedFiles: 100,
        completedPercentage: 100
      });
    }
  }, [checkPermissionStatus, requestStoragePermission, triggerHapticFeedback, triggerNotificationHaptic]);

  // Helper function to determine MIME type based on file extension
  const getMimeType = (fileName: string): string => {
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    switch (ext) {
      case '.mp3': return 'audio/mpeg';
      case '.wav': return 'audio/wav';
      case '.ogg': return 'audio/ogg';
      case '.m4a': return 'audio/m4a';
      case '.aac': return 'audio/aac';
      case '.flac': return 'audio/flac';
      default: return 'audio/mpeg';  // Default to mp3
    }
  };
  
  // For testing in web browser
  const simulateScanWithMockData = async (isDeep = false) => {
    const totalFiles = isDeep ? 200 : 100;
    const foundFiles = isDeep ? 50 : 25;
    
    for (let i = 0; i <= totalFiles; i += 10) {
      setScanProgress({
        totalFiles,
        scannedFiles: i,
        completedPercentage: Math.floor((i / totalFiles) * 100)
      });
      
      await new Promise(resolve => setTimeout(resolve, isDeep ? 300 : 200));
    }
    
    // Generate mock music files
    const mockMusicFiles: MusicFile[] = Array.from({ length: foundFiles }, (_, i) => ({
      id: `song-${i + 1}`,
      path: `/storage/emulated/0/${isDeep ? 'Deep/' : 'Music/'}song${i + 1}.mp3`,
      name: `song${i + 1}.mp3`,
      title: `Song Title ${i + 1}`,
      artist: i % 3 === 0 ? 'Artist A' : i % 3 === 1 ? 'Artist B' : 'Artist C',
      album: i % 5 === 0 ? 'Album X' : i % 5 === 1 ? 'Album Y' : i % 5 === 2 ? 'Album Z' : 'Greatest Hits',
      duration: 180 + i * 30, // Duration in seconds
      uri: `file:///storage/emulated/0/${isDeep ? 'Deep/' : 'Music/'}song${i + 1}.mp3`,
      mimeType: 'audio/mpeg'
    }));
    
    setMusicFiles(mockMusicFiles);
    
    toast({
      title: `${isDeep ? 'Deep scan' : 'Scan'} completed`,
      description: `Found ${mockMusicFiles.length} music files.`
    });
  };
  
  return {
    isScanning,
    isDeepScan,
    scanProgress,
    musicFiles,
    scanMusicFiles,
    deepScanMusicFiles,
    requestStoragePermission,
    permissionStatus
  };
}
