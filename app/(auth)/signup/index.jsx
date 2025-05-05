import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useState} from "react";
import {useRouter} from "expo-router";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../../firebaseConfig";
import {doc, setDoc} from "firebase/firestore";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  // const [apiURL, setApiURL] = useState(null || process.env.EXPO_PUBLIC_API_URL);
  const router = useRouter();
  const handleSubmit = () => {
    if (!name || !email || !number || !password) {
      alert("Please fill all the fields.");
      return;
    }

    if (!/^[a-zA-Z ]+$/.test(name)) {
      alert("Please enter a valid name.");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (!/^\d{10}$/.test(number)) {
      alert("Please enter a valid 10-digit number.");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        await setDoc(doc(db, "users", user.user.uid), {
          name: name,
          email: email,
          number: number,
          uploads: [],
          createdAt: new Date(),
        });
      })
      .catch((e) => {
        alert("Error", e.message);
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
            Create an Account.
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
            <Text style={styles.secondaryText}>Phone Number.</Text>
            <TextInput
              onChangeText={(e) => setNumber(e)}
              style={styles.input}
              placeholder="+91 XXXXXXXXXX"
              keyboardType="phone-pad"
            />
          </View>
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
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={{fontSize: 15, marginTop: 10}}>
                Already have an account ?{" "}
                <Text style={{color: "blue"}}>Log in.</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;

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
