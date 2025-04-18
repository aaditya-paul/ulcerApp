import {View, Text} from "react-native";
import React from "react";
// import UploadScreen from "./uploadScreen";
import DetailsScreen from "./loading";
import {StatusBar} from "expo-status-bar";
import SignUp from "./(auth)/signup";
import Login from "./(auth)/login";
import Loading from "./loading";

const App = () => {
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Loading />
      <StatusBar translucent backgroundColor="transparent" />
      {/* <Login /> */}
      {/* <SignUp /> */}
      {/* <Text>App</Text> */}
      {/* <UploadScreen /> */}
    </View>
  );
};

export default App;
