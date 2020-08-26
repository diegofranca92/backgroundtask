/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Platform,
  SafeAreaView
} from 'react-native';
import PushNotification from 'react-native-push-notification';
/* import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'; */
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';
import io from 'socket.io-client';

import { fcmService } from './src/FCMService';
import { localNotificationService } from './src/LocalNotificationService';
import AsyncStorage from '@react-native-community/async-storage'




import AppNavigator from './src/navigation/AppNavigator';
import Colors from './src/constants/Colors';
import FlashMessage from "react-native-flash-message";
import {decode, encode} from 'base-64'
/* import AnimatedLoader from "react-native-animated-loader"; */




const App = () => {
/*   const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userPosition, setUserPosition] = useState(false); */
  const [isLoadingComplete, setLoadingComplete] = useState(false);
 /*  const [clienteSocket, setClienteSocket] = useState(
    io('http://192.168.15.5:4000', {
      transports: ['websocket'],
      forceNew: true,
    }),
  ); */

  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  //For resolve axios bug (Basic Auth)
  if (!global.btoa) {
    global.btoa = encode;
  }
  if (!global.atob) {
    global.atob = decode;
  }

  useEffect(()=>{
    setInterval(() => {
      setLoadingComplete(true);
    }, 2000);
  },[])

  useEffect(()=>{
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification)
  },[])


  const onRegister = async(token) => {
    console.log("[App] Token", token);
    console.log(await AsyncStorage.getItem('user'));
  }

  const onNotification = (notify) => {
    // console.log("[App] onNotification", notify);
    
    const options = {
      soundName: 'default',
      playSound: true,
    }

    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify,
      options,
    )
  }

  const onOpenNotification = async (notify) => {
  
    console.log('notify', notify);
  }




 // Must be outside of any component LifeCycle (such as `componentDidMount`).
/*  PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    if (notification.foreground) {
      console.log('onNotification foreground', notification);
    } else {
      console.log('onNotification background or closed',
                 notification);
    }

    // process the notification
    
    // (required) Called when a remote is received or opened, or local notification is opened
    //notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  senderID:"137086602324",
  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATIONAction:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  invokeApp: function(notification){
    console.log("invokeapp")
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  
  requestPermissions: true,
});
 */

  const sendMessage = () =>{
    PushNotification.localNotification({
      /* Android Only Properties */
      ticker: "My Notification Ticker", // (optional)
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
      /* largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined */
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
      subText: "This is a subText", // (optional) default: none
     /*  bigPictureUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined */
      color: "red", // (optional) default: system default
     /*  vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: "some_tag", // (optional) add tag to message
      group: "group", // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      priority: "high", // (optional) set notification priority, default: high
      visibility: "private", // (optional) set notification visibility, default: private
      importance: "high", // (optional) set notification importance, default: high
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      channelId: "your-custom-channel-id", // (optional) custom channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
      onlyAlertOnce: false, //(optional) alert will open only once with sound and notify, default: false
        
      messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
     */
      /* actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more */
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
    
      /* iOS only properties */
    /*   alertAction: "view", // (optional) default: view
      category: "", // (optional) default: empty strin */
    
      /* iOS and Android properties */
      id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)
      userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: true, // (optional) default: true
      soundName: "notification_sound.mp3", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      /* number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero) */
      /* repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info. */
    });
  }

 /*  async function verifyLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log('permissão concedida');
        setHasLocationPermission(true);
      } else {
        //console.error('permissão negada');
        setHasLocationPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  } */

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
/*   BackgroundTimer.runBackgroundTimer(() => {
    verifyLocationPermission();
      const clienteSocket = io('http://192.168.15.5:4000', {
      transports: ['websocket'],
      forceNew: true,
    })

   
    Geolocation.getCurrentPosition(
      (position) => {
        var loc = {
          position,
          user: {
            nome: 'React Native',
          },
        };
       

        clienteSocket.emit('location', loc);
       
      },
      (error) => {
        console.log(error.code, error.message);
      },
    );
  }, 5000); */


  
    if(Platform.OS !== 'ios'){
      return (
        <SafeAreaView style={styles.container}>
       
          <StatusBar barStyle="light-content"/>
          <AppNavigator />
         
          <FlashMessage position="top" />
        </SafeAreaView>
      ); 
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content"/>
          <View style={styles.noData}>
            <Text style={styles.avisoNoData}>Platform not Supported!</Text>
          </View>
        </SafeAreaView>
      ); 
    }
  
}

/* async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      //require('./assets/images/robot-dev.png'),
      //require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}
 */


// backgroundColor: '#72B8F2', - azul #F0F0F0
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDefault, //'#FBFBFB', //Colors.backgroundDefault,
    fontFamily: 'space-mono',
  },
  noData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  avisoNoData: {
    //marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color:'#fff',
  },
});

 /*  return (
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
            <Button onPress={()=>sendMessage()} title="Click here to send"> </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  ); */
/* }; */



export default App;
