// SplashScreen.js
import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* You can add your logo or animation here */}
      <Image
        source={require("../assets/splash.png")}
        style={[styles.logo, {objectFit: "contain"}]}
      />
      {/* <Text style={styles.text}>Welcome to YourAppName</Text> */}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004471", // splash bg
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 500,
    height: 500,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
