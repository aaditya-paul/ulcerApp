import React, {useEffect, useState} from "react";
import {
  View,
  Button,
  Image,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LOGOUT from "../../../assets/logout.png";
import USERIMG from "../../../assets/user.png";
import * as ImagePicker from "expo-image-picker";
import {useLocalSearchParams, useNavigation} from "expo-router";
import CAM from "../../../assets/cam.png";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, db, storage} from "../../../firebaseConfig";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {doc, updateDoc, arrayUnion, setDoc} from "firebase/firestore";
import NavBarDrawer from "../../../components/navBarDrawer";

export default function UploadScreen({route}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(false);
  // const {email, name, number, user} = useLocalSearchParams(); // Destructure the params from the route
  const [USER, setUser] = useState(null);
  const nav = useNavigation();
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
          }),
        },
        {merge: true}
      );

      Alert.alert("Image URL saved successfully!");
    } catch (error) {
      console.error("Error uploading to storage and saving URL:", error);
      Alert.alert("Failed to upload image to storage.");
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
    fetch("http://192.168.117.96:5000/predict", {
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
        Alert.alert("Prediction Result", `Predicted Grade: ${predictedLabel}`);
        uploadImageToStorageAndSaveURL(predictedLabel); // Call the new function to upload to Firebase Storage and save URL
        setSelectedImage(null); // Reset selected image after upload
        setImageSelected(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Error", "Image upload failed", error.message);
      });
  };

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
        <View style={{width: "80%"}}>
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
              Submit
            </Text>
          </TouchableOpacity>
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
  },
  uploadSec: {
    width: "90%",
    height: "80%",
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
});
