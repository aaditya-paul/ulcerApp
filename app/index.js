import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {StatusBar} from "expo-status-bar";
import Login from "./(auth)/login"; // your actual entry screen
import SignUp from "./(auth)/signup";
import Loading from "./loading"; // or DetailsScreen
import SplashScreen from "../components/splashScreen";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000); // show splash for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" />
      {showSplash ? (
        <SplashScreen />
      ) : (
        // show your real content
        <Loading />
        // <Login />
        // <SignUp />
        // <Loading />
        // <UploadScreen />
      )}
    </View>
  );
};

export default App;
