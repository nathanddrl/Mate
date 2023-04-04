import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AcvitiviesMap from "../screens/ActivitiesMap";

export default function HeaderRight() {
  const navigation = useNavigation();

  const handleIconPress = () => {
    navigation.navigate("ActivitiesMap");
  };

  return (
    <TouchableOpacity onPress={handleIconPress} style={{ marginRight: 10 }}>
      <MaterialCommunityIcons name="map-search-outline" size={24} color="black" />
    </TouchableOpacity>
  );
}
