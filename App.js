/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';
import io from 'socket.io-client';

const App: () => React$Node = () => {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userPosition, setUserPosition] = useState(false);
  const [clienteSocket, setClienteSocket] = useState(
   
  );
  async function verifyLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('permissão concedida');
        setHasLocationPermission(true);
      } else {
        console.error('permissão negada');
        setHasLocationPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  }

/*   useEffect(() => {
    verifyLocationPermission();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error.code, error.message);
        },
      );
    }
  }, []); */

  // Start a timer that runs once after X milliseconds
  BackgroundTimer.runBackgroundTimer(() => {
    verifyLocationPermission();
  /*   const clienteSocket = io('http://192.168.15.5:4000', {
      transports: ['websocket'],
      forceNew: true,
    }) */
    Geolocation.getCurrentPosition(
      (position) => {
        
        var loc = {
          position,
          user:{
            nome: "React Native"
          }
        };
        console.log(loc)
       /*  clienteSocket.emit('location', loc);
        clienteSocket.on('locations', (data) => {
          console.log(data.data);
        }); */
       /*   setUserPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }); */
      },
      (error) => {
        console.log(error.code, error.message);
      },
    );

  }, 5000);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <Text>Latitude: {userPosition.latitude}</Text>
            <Text>Longitude: {userPosition.longitude}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
