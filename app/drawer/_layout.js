import {Drawer} from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "orange",
        drawerInactiveTintColor: "black",
        drawerStyle: {
          paddingTop: 20,
        },
      }}
    >
      <Drawer.Screen
        name="uploadScreen/index"
        options={{drawerLabel: "Upload Image"}}
      />
      <Drawer.Screen name="profile/index" options={{drawerLabel: "Profile"}} />
    </Drawer>
  );
}
