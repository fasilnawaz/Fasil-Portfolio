import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Alert, ScrollView, Image } from 'react-native';

// Dummy Data
const products = [
  { id: '1', name: 'Laptop', category: 'Electronics', price: 999, description: 'High-performance laptop.', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Smartphone', category: 'Electronics', price: 699, description: 'Latest smartphone.', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Headphones', category: 'Accessories', price: 199, description: 'Noise-cancelling headphones.', image: 'https://via.placeholder.com/150' },
];

const orders = [
  { id: '1', items: ['Laptop', 'Headphones'], total: 1198, status: 'Delivered' },
  { id: '2', items: ['Smartphone'], total: 699, status: 'In Progress' },
];

// Home Screen
const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.categoryContainer}>
        <Button title="All" onPress={() => setSelectedCategory('All')} />
        <Button title="Electronics" onPress={() => setSelectedCategory('Electronics')} />
        <Button title="Accessories" onPress={() => setSelectedCategory('Accessories')} />
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Product Details Screen
const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [cart, setCart] = useState([]);

  const addToCart = () => {
    setCart([...cart, product]);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImageLarge} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Button title="Add to Cart" onPress={addToCart} />
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
            <Image source={{ uri: item.image }} style={styles.productImageSmall} />
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

// Checkout Screen
const CheckoutScreen = ({ navigation }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const handleCheckout = () => {
    if (!paymentMethod || !shippingAddress) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    Alert.alert('Success', 'Your order has been placed!');
    navigation.navigate('OrderHistory');
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
        placeholder="Shipping Address"
        value={shippingAddress}
        onChangeText={setShippingAddress}
      />
      <Button title="Place Order" onPress={handleCheckout} />
    </View>
  );
};

// Order History Screen
const OrderHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
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

// Profile & Settings Screen
const ProfileScreen = () => {
  const [theme, setTheme] = useState('light');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    Alert.alert('Theme Changed', `Theme set to ${newTheme}.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Settings</Text>
      <Text>Select Theme:</Text>
      <Button title="Light Theme" onPress={() => handleThemeChange('light')} />
      <Button title="Dark Theme" onPress={() => handleThemeChange('dark')} />
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
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
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
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  productItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 8,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  productImageLarge: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  productImageSmall: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  productName: {
    fontSize: 18,
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});