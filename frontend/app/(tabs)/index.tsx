import React from "react";
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import {useAuth} from "@/security/AuthProvider";
import {Restaurant} from "@/api";
import {Card, Divider} from "react-native-paper";
import {Heart} from "lucide-react-native";

export default function Index() {
  const router = useRouter();
  const auth = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    auth.refreshUser();
    setRefreshing(false);
  }, []);

  const likedRestaurants = auth.user?.likedRestaurants || [];

  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push({
      pathname: "/map",
      params: {
        lat: restaurant.latitude,
        lng: restaurant.longitude,
        id: restaurant.id
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Your liked restaurants
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      >
        {likedRestaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              You haven't liked any restaurants yet.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push("/map")}
            >
              <Text style={styles.exploreButtonText}>Explore Restaurants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          likedRestaurants.map((restaurant, index) => (
            <React.Fragment key={restaurant.id}>
              <TouchableOpacity
                onPress={() => handleRestaurantPress(restaurant)}
              >
                <Card style={styles.restaurantCard}>
                  <Card.Content>
                    <View style={styles.restaurantHeader}>
                      <Text style={styles.restaurantName}>
                        {restaurant.name}
                      </Text>
                      <Heart
                        size={20}
                        color="#E57373"
                        fill="#E57373"
                        strokeWidth={2}
                      />
                    </View>

                    <Text style={styles.restaurantInfo}>
                      {restaurant.address}
                    </Text>
                    {restaurant.averageRating !== undefined && (
                      <Text style={styles.restaurantInfo}>
                        Rating: {restaurant.averageRating.toFixed(1)} ⭐️
                      </Text>
                    )}
                    {restaurant.tags && restaurant.tags.length > 0 && (
                      <Text style={styles.tags}>
                        {restaurant.tags.map(tag => tag.name).join(', ')}
                      </Text>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
              {index < likedRestaurants.length - 1 && <Divider style={styles.divider}/>}
            </React.Fragment>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  restaurantCard: {
    marginBottom: 8,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  restaurantInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tags: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  divider: {
    marginVertical: 8,
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: "#298a47",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
