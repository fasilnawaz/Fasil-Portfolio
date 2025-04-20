import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Alert } from 'react-native';

// Dummy Data
const events = [
  { id: '1', name: 'Movie: Avengers', type: 'Movie', location: 'New York' },
  { id: '2', name: 'Concert: Coldplay', type: 'Event', location: 'London' },
  { id: '3', name: 'Flight: New York', type: 'Travel', location: 'New York' },
  { id: '4', name: 'Movie: Spider-Man', type: 'Movie', location: 'Los Angeles' },
  { id: '5', name: 'Concert: Ed Sheeran', type: 'Event', location: 'Paris' },
];

// Home Screen
const HomeScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('EventDetails', { item })}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>{item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Search & Filter"
        onPress={() => navigation.navigate('SearchFilter')}
      />
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Search & Filter Screen
const SearchFilterScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);

  const handleSearch = () => {
    const filtered = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search events or locations"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('EventDetails', { item })}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.type}</Text>
            <Text style={styles.subtitle}>{item.location}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Event Details Screen
const EventDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>{item.type}</Text>
      <Text style={styles.details}>Location: {item.location}</Text>
      <Button title="Book Now" onPress={() => navigation.navigate('SeatSelection', { item })} />
    </View>
  );
};

// Seat Selection Screen
const SeatSelectionScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seats = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'];

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Seats for {item.name}</Text>
      <View style={styles.seatContainer}>
        {seats.map((seat) => (
          <TouchableOpacity
            key={seat}
            style={[
              styles.seat,
              selectedSeats.includes(seat) && styles.selectedSeat,
            ]}
            onPress={() => toggleSeat(seat)}
          >
            <Text>{seat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        title="Proceed to Payment"
        onPress={() => navigation.navigate('Payment', { item, selectedSeats })}
      />
    </View>
  );
};

// Payment Screen
const PaymentScreen = ({ route, navigation }) => {
  const { item, selectedSeats } = route.params;
  const [discountCode, setDiscountCode] = useState('');
  const totalAmount = selectedSeats.length * 10; // $10 per seat

  const applyDiscount = () => {
    if (discountCode === 'DISCOUNT10') {
      Alert.alert('Discount Applied', '10% discount has been applied.');
    } else {
      Alert.alert('Invalid Code', 'The discount code is invalid.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Screen</Text>
      <Text>Total Amount: ${totalAmount}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Discount Code"
        value={discountCode}
        onChangeText={setDiscountCode}
      />
      <Button title="Apply Discount" onPress={applyDiscount} />
      <Button
        title="Pay Now"
        onPress={() => navigation.navigate('BookingConfirmation', { item, selectedSeats })}
      />
    </View>
  );
};

// Booking Confirmation Screen
const BookingConfirmationScreen = ({ route }) => {
  const { item, selectedSeats } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text>Event: {item.name}</Text>
      <Text>Seats: {selectedSeats.join(', ')}</Text>
      <Text>Thank you for your booking.</Text>
    </View>
  );
};

// My Bookings Screen
const MyBookingsScreen = () => {
  const bookings = [
    { id: '1', name: 'Movie: Avengers', date: '2023-10-15' },
    { id: '2', name: 'Concert: Coldplay', date: '2023-11-20' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.date}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Profile & Settings Screen
const ProfileSettingsScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Settings</Text>
      <Text>User Details</Text>
      <Text>Payment History</Text>
      <Button title="Logout" onPress={handleLogout} />
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
        <Stack.Screen name="SearchFilter" component={SearchFilterScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
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
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  details: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  seatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  seat: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  selectedSeat: {
    backgroundColor: 'green',
  },
});