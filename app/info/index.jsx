import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import {useRouter} from "expo-router/build";

const Info = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Diabetic Foot Ulcer</Text>
        <Text style={styles.paragraph}>
          A Diabetic Foot Ulcer is an open sore or wound that occurs on the foot
          of a person with diabetes. It typically results from a combination of
          factors:
        </Text>

        <Text style={styles.bullet}>• Neuropathy (nerve damage)</Text>
        <Text style={styles.bullet}>
          • Peripheral arterial disease (poor circulation)
        </Text>
        <Text style={styles.bullet}>• Foot deformities</Text>
        <Text style={styles.bullet}>• Minor trauma or pressure points</Text>

        <Text style={styles.paragraph}>
          These ulcers can become infected and may lead to severe complications,
          including amputation, if not properly treated.
        </Text>

        <Text style={styles.paragraph}>
          Several classification systems exist for grading DFUs. The most
          commonly used grading system is{" "}
          <Text style={styles.bold}>Wagner's grading system</Text>.
        </Text>

        <Image
          source={require("../../assets/info.jpg")} // make sure the path is correct
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.caption}>Figure: DFU Classification Reference</Text>
      </ScrollView>
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "orange",
          borderRadius: 8,
          marginBottom: 2,
          alignItems: "center",
        }}
        onPress={() => router.replace("/drawer/uploadScreen")}
      >
        <Text style={{color: "white", fontSize: 18, fontWeight: "bold"}}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    height: "100%",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#2e2e2e",
  },
  paragraph: {
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
    lineHeight: 22,
  },
  bullet: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 6,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  image: {
    width: "100%",
    height: 250,
    marginTop: 20,
    borderRadius: 8,
  },
  caption: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});
