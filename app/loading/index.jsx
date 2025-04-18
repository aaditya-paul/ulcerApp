import {View, Text, ActivityIndicator} from "react-native";
import React, {useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../../firebaseConfig";
import {useRouter} from "expo-router";

const Loading = () => {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        //!  // TODO CHANGED
        router.replace("/drawer/uploadScreen", {
          params: {
            email: user.email,
            user: user,
          },
        });

        // Navigate to the upload screen or any other screen you want
      } else {
        console.log("No user is signed in.");
        router.replace("/(auth)/login");
        // Navigate to the login or signup screen
      }
    });
  }, []);
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator size="80" color="black" />
      <Text style={{fontSize: 20, fontWeight: "600"}}>Please Wait...</Text>
    </View>
  );
};

export const Loader = () => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator size="80" color="black" />
      <Text style={{fontSize: 20, fontWeight: "600"}}>Please Wait...</Text>
    </View>
  );
};

export default Loading;
