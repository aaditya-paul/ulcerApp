import React, {useCallback, useEffect, useState} from "react";
import {
  View,
  Button,
  Image,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import LOGOUT from "../../../assets/logout.png";
import USERIMG from "../../../assets/user.png";
import * as ImagePicker from "expo-image-picker";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import CAM from "../../../assets/cam.png";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, db, storage} from "../../../firebaseConfig";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {doc, updateDoc, arrayUnion, setDoc} from "firebase/firestore";
import NavBarDrawer from "../../../components/navBarDrawer";
import {TextInput} from "react-native-gesture-handler";

export default function UploadScreen({route}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  const [submitting, setSubmitting] = useState(false); // State to track if the image is being submitted
  // const {email, name, number, user} = useLocalSearchParams(); // Destructure the params from the route
  const [USER, setUser] = useState(null);
  const [detailsScreen, setDetailsScreen] = useState(true);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBMI] = useState("");

  const nav = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setDetailsScreen(true); // Reset to Step 1
    }, [])
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("User is signed in:", user);
      } else {
        // console.log("No user is signed in.");
      }
    });
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageSelected(true);
    } else {
      setSelectedImage(null);
      setImageSelected(false);
    }
  };

  const handleDetailSubmit = async () => {
    if (!name || !address || !age || !bmi) {
      Alert.alert("Please fill all the fields.");
      return;
    }
    if (isNaN(age) || isNaN(bmi)) {
      Alert.alert("Age and BMI must be numbers.");
      return;
    }

    console.log("Details submitted:", {
      name,
      address,
      age,
      bmi,
    });

    setDetailsScreen(false);

    // if (USER) {
    //   const userDocRef = doc(db, "users", USER.uid);
    //   await setDoc(
    //     userDocRef,
    //     {
    //       name: name,
    //       address: address,
    //       age: age,
    //       bmi: bmi,
    //       createdAt: new Date(),
    //     },
    //     {merge: true}
    //   );
    //   setDetailsScreen(false);
    // } else {
    //   Alert.alert("User not found.");
    // }
  };

  const clickImage = async () => {
    // Request camera permissions if not already granted
    const {status} = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera permission is required to take a photo.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageSelected(true);
    } else {
      setSelectedImage(null);
      setImageSelected(false);
    }
  };

  // 🔹 New function added here (above uploadImage)
  const uploadImageToStorageAndSaveURL = async (res) => {
    if (!selectedImage) {
      Alert.alert("Please select an image first");
      return;
    }

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      const filename = `${Date.now()}_${selectedImage.split("/").pop()}`;
      const storageRef = ref(storage, `uploads/${USER.email}/${filename}`);

      // Upload image to Firebase Storage
      await uploadBytes(storageRef, blob);

      // Get downloadable URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save to Firestore under uploads array
      const userDocRef = doc(db, "users", USER.uid);
      await setDoc(
        userDocRef,
        {
          uploads: arrayUnion({
            url: downloadURL,
            name: filename,
            createdAt: new Date(),
            result: res,
            details: {
              name: name,
              address: address,
              age: age,
              bmi: bmi,
            },
          }),
        },
        {merge: true}
      );
      ToastAndroid.show(
        "Image URL saved successfully!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      // Alert.alert("Image URL saved successfully!");
      // redirect to the result page with the predicted label
      router.push({
        pathname: "/result",
        params: {
          result: res,
          image: downloadURL,
          // image: selectedImage,
        },
      });
      setSubmitting(false); // Reset submitting state after upload
      setSelectedImage(null); // Reset selected image after upload
      setImageSelected(false);
    } catch (error) {
      console.error("Error uploading to storage and saving URL:", error);
      ToastAndroid.show(
        "Image URL saved successfully!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );

      setSubmitting(false); // Reset submitting state after upload
    }
  };

  // 🔸 DO NOT MODIFY THIS FUNCTION
  // const uploadImage = async () => {
  //   if (!selectedImage) {
  //     Alert.alert("Please select an image first");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(selectedImage);
  //     const blob = await response.blob();

  //     const filename = `${Date.now()}_${selectedImage.split("/").pop()}`;
  //     const storageRef = ref(storage, `uploads/${email}/${filename}`);

  //     // Upload to Firebase Storage
  //     await uploadBytes(storageRef, blob);

  //     // Get downloadable URL
  //     const downloadURL = await getDownloadURL(storageRef);

  //     // Push the URL to Firestore under the uploads array
  //     const userDocRef = doc(db, "users", email); // Adjust if using UID instead
  //     await updateDoc(userDocRef, {
  //       uploads: arrayUnion(downloadURL),
  //     });

  //     Alert.alert("Success", "Image uploaded and saved successfully.");
  //     setSelectedImage(null);
  //     setImageSelected(false);
  //   } catch (error) {
  //     console.error("Upload failed", error);
  //     Alert.alert("Error", "Image upload failed");
  //   }
  // };

  const uploadImage = async () => {
    setSubmitting(true); // Set submitting to true when starting the upload
    if (!selectedImage) {
      Alert.alert("Please select an image first");
      return;
    }

    // Prepare the image data to send to the backend
    const formData = new FormData();
    const filename = selectedImage.split("/").pop(); // Get file name from the URI
    formData.append("image", {
      uri: selectedImage,
      type: "image/jpeg", // or use another MIME type if applicable
      name: filename,
    });

    // Send image to the backend for processing
    // fetch("http://192.168.219.96:5000/predict", {
    fetch("https://ulcer-app-backend.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the backend returns a 'predicted_label' in the response
        const predictedLabel = data.predicted_label;

        // Alert.alert("Prediction Result", `Predicted Grade: ${predictedLabel}`);
        uploadImageToStorageAndSaveURL(predictedLabel); // Call the new function to upload to Firebase Storage and save URL

        // setSubmitting(false); // Reset submitting state after upload
      })
      .catch((error) => {
        // console.error("Error:", error);
        ToastAndroid.show(
          "Image upload failed",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        setSubmitting(false); // Reset submitting state after upload
        // Alert.alert("Error", "Image upload failed", error.message);
      });
  };
  if (detailsScreen) {
    return (
      <NavBarDrawer title="Enter Details">
        <ScrollView>
          <View style={styles.container}>
            <View
              style={{
                width: "80%",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              >
                Enter Details.
              </Text>
              <View style={styles.fields}>
                <Text style={styles.secondaryText}>Name.</Text>
                <TextInput
                  onChangeText={(e) => setName(e)}
                  style={styles.input}
                  placeholder="John Doe"
                />
              </View>

              <View style={styles.fields}>
                <Text style={styles.secondaryText}>Address.</Text>
                <TextInput
                  onChangeText={(e) => setAddress(e)}
                  autoCapitalize="none"
                  style={styles.input}
                  placeholder=" Street, City, State, Zip"
                  // secureTextEntry
                />
              </View>
              <View style={styles.fields}>
                <Text style={styles.secondaryText}>Age.</Text>
                <TextInput
                  onChangeText={(e) => setAge(e)}
                  autoCapitalize="none"
                  style={styles.input}
                  placeholder="18"
                  keyboardType="numeric"
                  // secureTextEntry
                />
              </View>
              <View style={styles.fields}>
                <Text style={styles.secondaryText}>BMI.</Text>
                <TextInput
                  onChangeText={(e) => setBMI(e)}
                  autoCapitalize="none"
                  style={styles.input}
                  placeholder=" 18.5"
                  keyboardType="numeric"
                  // secureTextEntry
                />
              </View>
              <View>
                <TouchableOpacity
                  onPress={handleDetailSubmit}
                  style={{
                    backgroundColor: "#000",
                    padding: 15,
                    borderRadius: 5,
                    marginTop: 20,
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.secondaryText, {color: "white"}]}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </NavBarDrawer>
    );
  }
  return (
    <NavBarDrawer title="Upload Image">
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.uploadSec}>
          <Image
            source={imageSelected ? {uri: selectedImage} : CAM}
            style={
              imageSelected
                ? {
                    width: "100%",
                    height: "100%",
                    padding: 10,
                    objectFit: "cover",
                    borderRadius: 10,
                  }
                : {width: 250, height: 250}
            }
          />
          {!imageSelected && (
            <Text
              style={{
                color: "#f65e09",
                fontWeight: "600",
                position: "relative",
              }}
            >
              Click To Upload Image!
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            width: "80%",
            flexDirection: "coloumn",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={clickImage}
            style={[
              styles.btn,
              {
                backgroundColor: "#6a5dbf",
              },
            ]}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Take an Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!imageSelected}
            onPress={uploadImage}
            style={[
              styles.btn,
              imageSelected
                ? {
                    backgroundColor: "#f17a0e",
                  }
                : {
                    backgroundColor: "#ccc",
                  },
            ]}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              {submitting ? (
                <ActivityIndicator size={24} color={"#fff"} />
              ) : (
                "Submit"
              )}
              {/* Submit */}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => router.push("/result")}>
            <Text>Test</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </NavBarDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // TODO changed 50 to 20
    marginTop: 20,
    height: "100%",
  },
  containerScroll: {
    flex: 1,
    // alignItems: "center",
    // TODO changed 50 to 20
    marginTop: 20,
    height: "100%",
  },
  uploadSec: {
    width: "90%",
    height: "75%",
    backgroundColor: "#117eee20",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
    marginBottom: 20,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#117eee",
  },
  btn: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  fields: {
    marginTop: 15,
    width: "100%",
  },

  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 12,
    marginTop: 2,
    borderRadius: 5,
  },
  secondaryText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  // btn: {
  //   backgroundColor: "#000",
  //   padding: 15,
  //   borderRadius: 5,
  //   marginTop: 20,
  //   alignItems: "center",
  // },
});
