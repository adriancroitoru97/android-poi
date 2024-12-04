import {IconButton, Menu} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {useRouter} from "expo-router";
import {useState} from "react";
import {useAuth} from "@/security/AuthProvider";

export const HeaderRightMenu = () => {
  const auth = useAuth();
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  return <View style={styles.menuContainer}>
    <Menu
      visible={menuVisible}
      onDismiss={closeMenu}
      anchor={
        <IconButton icon="dots-vertical" onPress={toggleMenu}/>
      }
      anchorPosition={"bottom"}
    >
      <Menu.Item
        onPress={() => {
          closeMenu();
          router.push("/profile");
        }}
        title="Profile"
        leadingIcon="account"
      />
      <Menu.Item
        onPress={() => {
          closeMenu();
          auth.logout();
        }}
        title="Logout"
        leadingIcon="logout"
      />
    </Menu>
  </View>
}

const styles = StyleSheet.create({
  menuContainer: {
    marginRight: 8,
  },
});
