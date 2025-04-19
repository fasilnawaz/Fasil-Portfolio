import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';

// Dummy Data
const restaurants = [
  { id: '1', name: 'Burger King', rating: 4.5, menu: [{ id: '1', name: 'Cheeseburger', price: 5 }, { id: '2', name: 'Fries', price: 3 }] },
  { id: '2', name: 'Pizza Hut', rating: 4.2, menu: [{ id: '3', name: 'Pepperoni Pizza', price: 10 }, { id: '4', name: 'Garlic Bread', price: 4 }] },
];

const orders = [
  { id: '1', restaurant: 'Burger King', items: ['Cheeseburger', 'Fries'], total: 8, status: 'Delivered' },
  { id: '2', restaurant: 'Pizza Hut', items: ['Pepperoni Pizza'], total: 10, status: 'In Progress' },
];

// Home Screen
const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredRestaurants}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.restaurantItem}
            onPress={() => navigation.navigate('RestaurantDetails', { restaurant: item })}
          >
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantRating}>Rating: {item.rating}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Restaurant Details Screen
const RestaurantDetailsScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
    Alert.alert('Added to Cart', `${item.name} has been added to your cart.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text style={styles.subtitle}>Menu:</Text>
      <FlatList
        data={restaurant.menu}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
            <Button title="Add to Cart" onPress={() => addToCart(item)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Button title="View Cart" onPress={() => navigation.navigate('Cart', { cart })} />
    </View>
  );
};

// Cart Screen
const CartScreen = ({ route, navigation }) => {
  const { cart } = route.params;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cart}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.totalPrice}>Total: ${totalPrice}</Text>
      <Button title="Checkout" onPress={() => navigation.navigate('Checkout')} />
    </View>
  );
};

// Checkout & Payment Screen
const CheckoutScreen = ({ navigation }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleCheckout = () => {
    if (!paymentMethod || !deliveryAddress) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    Alert.alert('Success', 'Your order has been placed!');
    navigation.navigate('OrderTracking');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <TextInput
        style={styles.input}
        placeholder="Payment Method"
        value={paymentMethod}
        onChangeText={setPaymentMethod}
      />
      <TextInput
        style={styles.input}
        placeholder="Delivery Address"
        value={deliveryAddress}
        onChangeText={setDeliveryAddress}
      />
      <Button title="Place Order" onPress={handleCheckout} />
    </View>
  );
};

// Order Tracking Screen
const OrderTrackingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Tracking</Text>
      <Text>Your order is on the way!</Text>
    </View>
  );
};

// Profile & Order History Screen
const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>{item.restaurant}</Text>
            <Text>Items: {item.items.join(', ')}</Text>
            <Text>Total: ${item.total}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Navigation Stack
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  restaurantItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 8,
  },
  restaurantName: {
    fontSize: 18,
  },
  restaurantRating: {
    fontSize: 14,
    color: 'gray',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  menuItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  cartItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  orderItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 8,
  },
});