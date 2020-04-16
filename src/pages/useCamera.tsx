import { useState, useEffect } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";

export interface Photo {
    filepath: string;
    webviewPath?: string;
    base64?: string;
  }

  const PHOTO_STORAGE = "photos";

export function usePhotoGallery() {

    const { getPhoto } = useCamera();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const { deleteFile, getUri, readFile, writeFile } = useFilesystem();
    const { get, set } = useStorage();

    useEffect(() => {
        const loadSaved = async () => {
            const photosString = await get('photos');
            const photosInStorage = (photosString ? JSON.parse(photosString) : []) as Photo[];
            // If running on the web...
            if (!isPlatform('hybrid')) {
              for (let photo of photosInStorage) {
                const file = await readFile({
                  path: photo.filepath,
                  directory: FilesystemDirectory.Data
                });
                // Web platform only: Save the photo into the base64 field
                photo.base64 = `data:image/jpeg;base64,${file.data}`;
              }
            }
            setPhotos(photosInStorage);
          };
        loadSaved();
      }, [get, readFile]);
  
    const takePhoto = async () => {
      const cameraPhoto = await getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });
      const fileName = new Date().getTime() + '.jpeg';
      const savedFileImage = await savePicture(cameraPhoto, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);
        set(PHOTO_STORAGE,
            isPlatform('hybrid')
              ? JSON.stringify(newPhotos)
              : JSON.stringify(newPhotos.map(p => {
                const photoCopy = { ...p };
                delete photoCopy.base64;
                return photoCopy;
              })));
    };

    const savePicture = async (photo: CameraPhoto, fileName: string) => {
        let base64Data: string;
        // "hybrid" will detect Cordova or Capacitor;
        if (isPlatform('hybrid')) {
          const file = await readFile({
            path: photo.path!
          });
          base64Data = file.data;
        } else {
          base64Data = await base64FromPath(photo.webPath!);
        }
        await writeFile({
          path: fileName,
          data: base64Data,
          directory: FilesystemDirectory.Data
        });
        return getPhotoFile(photo, fileName);
      };
      
      const getPhotoFile = async (cameraPhoto: CameraPhoto, fileName: string): Promise<Photo> => {
        if (isPlatform('hybrid')) {
          // Get the new, complete filepath of the photo saved on filesystem
          const fileUri = await getUri({
            directory: FilesystemDirectory.Data,
            path: fileName
          });
      
          return {
            filepath: fileUri.uri,
            webviewPath: Capacitor.convertFileSrc(fileUri.uri),
          };
        }
        else {
          return {
            filepath: fileName,
            webviewPath: cameraPhoto.webPath
          };
        }
      };
  
    return {
        photos,
      takePhoto
    };
  }