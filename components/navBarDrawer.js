import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {useNavigation} from "expo-router";

const NavBarDrawer = ({title, children}) => {
  const nav = useNavigation();

  return (
    <View style={{height: "100%", width: "100%"}}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 35,
          paddingVertical: 20,
          backgroundColor: "#fff",
          width: "100%",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          elevation: 5,
        }}
      >
        <Text style={{fontSize: 24, fontWeight: "bold"}}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            nav.openDrawer();
          }}
        >
          <Image
            source={require("../assets/hamburger.png")}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

export default NavBarDrawer;

const styles = StyleSheet.create({});
