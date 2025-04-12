import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useState} from "react";
import {useRouter} from "expo-router";
import {app, auth} from "../../../firebaseConfig";
import {signInWithEmailAndPassword} from "firebase/auth";
import {handleAuthError} from "../../../utils/firebase/errorhandler";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    if (!email || !password) {
      alert("Please fill all the fields.");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {})
      .catch((e) => {
        Alert.alert("Error", handleAuthError(e));
        console.log("Error", e.message);
      });
  };

  return (
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
            Welcome Back!
          </Text>

          <View style={styles.fields}>
            <Text style={styles.secondaryText}>Email.</Text>
            <TextInput
              onChangeText={(e) => setEmail(e)}
              keyboardType="email-address"
              style={styles.input}
              placeholder="john@doe.com"
            />
          </View>
          <View style={styles.fields}>
            <Text style={styles.secondaryText}>Password.</Text>
            <TextInput
              onChangeText={(e) => setPassword(e)}
              autoCapitalize="none"
              style={styles.input}
              placeholder="Password"
              secureTextEntry
            />
          </View>
          <View>
            <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
              <Text style={[styles.secondaryText, {color: "white"}]}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={{fontSize: 15, marginTop: 10}}>
                Dont have an account ?{" "}
                <Text style={{color: "blue"}}>Sign Up.</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    marginTop: 50,
    alignItems: "center",
    marginBottom: 20,
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
  btn: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
});
