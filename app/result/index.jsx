import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Touchable,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, {useEffect, useState} from "react";
import NavBarDrawer, {Header} from "../../components/navBarDrawer";
import {useLocalSearchParams} from "expo-router";
import {Loader} from "../loading";

const Result = () => {
  const {result, image} = useLocalSearchParams(); // Assume result and image URL are passed
  const [loading, setLoading] = useState(true);
  let url = encodeURIComponent(image);
  useEffect(() => {
    // Simulate a small delay to make the UI feel natural
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (result === undefined || image === undefined) {
    return (
      <Header title="Result">
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            No result available. Please upload an image first.
          </Text>
        </View>
      </Header>
    );
  }

  if (loading) {
    return (
      <Header title="Result">
        <Loader />
      </Header>
    );
  }

  return (
    <Header title="Result">
      <View style={styles.container}>
        {/* <Image
          source={{uri: image}}
          width={500}
          height={500}
          style={styles.uploadedImage}
        /> */}
        {/* <TouchableOpacity onPress={() => Linking.openURL(image)}>
          <Text>Open Image</Text>
        </TouchableOpacity> */}

        <Text style={styles.resultText}>Predicted Grade:</Text>
        <Text style={styles.result}>{result}</Text>
      </View>
    </Header>
  );
};

export default Result;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 20,
    // paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadedImage: {
    width: "90%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: "cover",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
  },
  result: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#f17a0e",
    marginTop: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    padding: 20,
  },
});
