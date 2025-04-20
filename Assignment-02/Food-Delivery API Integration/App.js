import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Picker } from 'react-native';

// Mock API data (static JSON)
const mockRestaurants = [
  { id: 1, name: 'Burger King', cuisine: 'Fast Food', rating: 4.2 },
  { id: 2, name: 'Pizza Hut', cuisine: 'Italian', rating: 4.0 },
  { id: 3, name: 'Sushi Palace', cuisine: 'Japanese', rating: 4.5 },
  { id: 4, name: 'Taco Bell', cuisine: 'Mexican', rating: 3.8 },
  { id: 5, name: 'Thai Orchid', cuisine: 'Thai', rating: 4.7 },
  { id: 6, name: 'McDonald\'s', cuisine: 'Fast Food', rating: 3.9 },
];

const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchRestaurants = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Filter restaurants by cuisine type
    if (selectedCuisine === 'All') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(
        (restaurant) => restaurant.cuisine === selectedCuisine
      );
      setFilteredRestaurants(filtered);
    }
  }, [selectedCuisine, restaurants]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Delivery App</Text>

      {/* Cuisine Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Cuisine:</Text>
        <Picker
          selectedValue={selectedCuisine}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCuisine(itemValue)}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Fast Food" value="Fast Food" />
          <Picker.Item label="Italian" value="Italian" />
          <Picker.Item label="Japanese" value="Japanese" />
          <Picker.Item label="Mexican" value="Mexican" />
          <Picker.Item label="Thai" value="Thai" />
        </Picker>
      </View>

      {/* Restaurants List */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.restaurantCard}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
            <Text style={styles.restaurantRating}>Rating: {item.rating} ⭐</Text>
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#888',
  },
  restaurantRating: {
    fontSize: 14,
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default HomeScreen;