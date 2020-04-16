import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonCol, IonImg, IonRow } from '@ionic/react';
import React from 'react';
import { camera, trash, close } from 'ionicons/icons';
import './Home.css';
import {usePhotoGallery} from './useCamera'

const Camera: React.FC = () => {


  const { photos,takePhoto } = usePhotoGallery();
  return (
    <IonContent>
      <IonGrid>
    <IonRow>
      {photos.map((photo, index) => (
        <IonCol size="6" key={index}>
          <IonImg src={photo.base64 ?? photo.webviewPath} />
        </IonCol>
      ))}
    </IonRow>
  </IonGrid>
  <IonFab vertical="bottom" horizontal="center" slot="fixed">
    <IonFabButton onClick={() => takePhoto()}>
      <IonIcon icon={camera}></IonIcon>
    </IonFabButton>
  </IonFab>
</IonContent>
  );
};

export default Camera;
