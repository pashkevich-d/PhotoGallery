import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';
import React from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pashkevich Dmitry's App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Pashkevich Dmitry's App</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
        <IonRouterLink href="camera">Camera stuff</IonRouterLink>
      </IonContent>
    </IonPage>
  );
};

export default Home;
