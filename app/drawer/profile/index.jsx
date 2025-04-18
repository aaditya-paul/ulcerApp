// Profile.js
import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import NavBarDrawer from "../../../components/navBarDrawer";
import {router} from "expo-router";
import Loading, {Loader} from "../../loading";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "../../../firebaseConfig";
import {onAuthStateChanged} from "firebase/auth";
import {ScrollView, RefreshControl} from "react-native";

// Example: Simulated fetch function (replace with Firebase logic)
const fetchUserData = async (uid) => {
  return new Promise((resolve) => {
    getDoc(doc(db, "users", uid)) // Replace with the actual user ID
      .then((doc) => {
        if (doc.exists()) {
          resolve(doc.data());
        } else {
          console.log("No such document!");
          resolve(null);
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        resolve(null);
      });
  });
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    const currentUser = auth.currentUser;
    if (currentUser) {
      const data = await fetchUserData(currentUser.uid);
      setUser(data);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        fetchUserData(user.uid).then((data) => {
          // console.log("User data:", data);

          setUser(data);
          setLoading(false);
        });
      } else {
        console.log("No user is signed in.");
        router.replace("/(auth)/login");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // useEffect(() => {
  //   fetchUserData().then((data) => {
  //     setUser(data);
  //     setLoading(false);
  //   });
  // }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
  }

  return (
    <NavBarDrawer title="Profile">
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 20}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push("/edit")}>
              <Image
                source={require("../../../assets/edit.png")}
                style={{
                  width: 30,
                  height: 30,
                  alignSelf: "flex-end",
                  marginBottom: 10,
                }}
              />
            </TouchableOpacity>

            <View style={{alignItems: "center"}}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    user?.photo
                      ? {uri: user?.photo} // Make sure to wrap photo in `{ uri: ... }`
                      : require("../../../assets/user.png")
                  }
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                  resizeMode="cover"
                />
              </View>
            </View>

            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user.name}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>+91 {user.number}</Text>
            <View>
              <Text style={styles.label}>Uploaded Files</Text>
              {user.uploads.map((item, index) => (
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    backgroundColor: "#f6f6f6",
                    borderColor: "black",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    padding: 10,
                    borderRadius: 10,
                    elevation: 2,
                    flexDirection: "column",
                  }}
                  key={index}
                  onPress={() => {
                    Linking.openURL(item.url);
                  }}
                >
                  <View>
                    <Text style={styles.value}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </NavBarDrawer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginTop: 15,
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
});
