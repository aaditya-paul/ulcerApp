import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {doc, updateDoc, getDoc} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {auth, db, storage} from "../../firebaseConfig";
import {useRouter} from "expo-router";
import {Loader} from "../loading";

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setNumber(data.number || "");
          setPhoto(data.photo || null);
        }
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!name || !number) {
      Alert.alert("Error", "Name and number cannot be empty.");
      return;
    }

    setUploading(true);

    try {
      let photoURL = photo;

      // If new image selected (local uri)
      if (photo && photo.startsWith("file://")) {
        const response = await fetch(photo);
        const blob = await response.blob();

        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, blob);

        photoURL = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "users", user.uid), {
        name: name,
        number: number,
        photo: photoURL,
      });

      Alert.alert("Success", "Profile updated!");
      router.back(); // Go back after saving
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  if (name === "" || number === "") {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={photo ? {uri: photo} : require("../../assets/user.png")}
          style={styles.profileImage}
        />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          value={number}
          onChangeText={setNumber}
          placeholder="Enter your number"
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={uploading}
      >
        <Text style={styles.saveButtonText}>
          {uploading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: "#fff"},
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  changePhoto: {textAlign: "center", color: "#007bff", marginBottom: 30},
  inputContainer: {marginBottom: 20},
  label: {fontSize: 16, color: "#555", marginBottom: 5},
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {color: "#fff", fontWeight: "bold", textAlign: "center"},
});
