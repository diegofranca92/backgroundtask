/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-community/async-storage';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  BackgroundTimer.runBackgroundTimer(async () => {
    await AsyncStorage.setItem('user', 'BackgroundAsyncStop60');
    console.log(await AsyncStorage.getItem('user'));
     const URL_TO_FETCH = 'https://api.github.com/search/repositories?q=javascrip';
    fetch(URL_TO_FETCH, {
      method: 'get', // opcional
      headers: {'Content-Type':'application/x-www-form-urlencoded'}, 
    })
      .then(function (response) {
        console.log(response.json())
      })
      .catch(function (err) {
        console.error(err);
      });
     
        const rawResponse = await fetch('https://httpbin.org/post', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({a: 1, b: 'Background Flash Entregas'})
        });
        const content = await rawResponse.json();
      
        console.log(content);
      
    BackgroundTimer.stopBackgroundTimer();
  }, 3000);
});

AppRegistry.registerComponent(appName, () => App);
