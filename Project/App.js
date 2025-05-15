import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Feather } from '@expo/vector-icons';

// Event Type
type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  imageUrl: string;
  categories: string[];
  team1?: string;
  team2?: string;
};

type BookingDetails = {
  seats: { id: string; row: string; number: number; price: number }[];
  totalPrice: number;
};

// Mock Event Data
const mockEvent: Event = {
  id: '1',
  title: 'PSL Match: Karachi vs Lahore',
  description: 'An exciting PSL T20 match between Karachi and Lahore.',
  date: '2025-06-01',
  time: '7:00 PM',
  venue: 'National Stadium Karachi',
  price: 500,
  imageUrl: 'https://via.placeholder.com/600x400',
  categories: ['Cricket', 'Sports', 'PSL'],
  team1: 'Karachi',
  team2: 'Lahore',
};

const getEventById = (id: string): Event | undefined => (id === '1' ? mockEvent : undefined);

// Footer Component
const Footer = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>© 2025 EventApp. All rights reserved.</Text>
    <TouchableOpacity onPress={() => Linking.openURL('mailto:support@eventapp.com')}>
      <Text style={styles.footerLink}>Contact Us</Text>
    </TouchableOpacity>
  </View>
);

// Featured Event Screen
const FeaturedEventScreen = ({ navigation }) => {
  const event = mockEvent;
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.featuredContainer}>
        <Image source={{ uri: event.imageUrl }} style={styles.featuredImage} />
        <View style={styles.overlay} />
        <View style={styles.featuredContent}>
          <View style={styles.categories}>
            {event.categories.map((category) => (
              <View key={category} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDescription} numberOfLines={2}>
            {event.description}
          </Text>
          <View style={styles.eventDetails}>
            <View style={styles.detailItem}>
              <Feather name="calendar" size={20} color="#fff" />
              <Text style={styles.detailText}>{formattedDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="clock" size={20} color="#fff" />
              <Text style={styles.detailText}>{event.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="map-pin" size={20} color="#fff" />
              <Text style={styles.detailText}>{event.venue}</Text>
            </View>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('EventDetails', { id: event.id })}
            >
              <Text style={styles.buttonText}>Get Tickets</Text>
            </TouchableOpacity>
            <Text style={styles.priceText}>From ₹{event.price}</Text>
          </View>
        </View>
      </View>
      <Footer />
    </ScrollView>
  );
};

// Event Details Screen
const EventDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const event = getEventById(id);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'details', title: 'Match Details' },
    { key: 'venue', title: 'Venue' },
  ]);

  if (!event) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FeaturedEvent')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
        <Footer />
      </ScrollView>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const DetailsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>About This Match</Text>
      <Text style={styles.sectionText}>{event.description}</Text>
      <Text style={styles.sectionText}>
        Witness the excitement of PSL live at the stadium. Bring your friends and family to enjoy a thrilling day of T20 cricket action featuring some of the best players from Pakistan and around the world.
      </Text>
      <Text style={styles.sectionTitle}>Match Details</Text>
      <View style={styles.detailItem}>
        <Feather name="calendar" size={20} color="#007AFF" />
        <View>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailText}>{formattedDate}</Text>
        </View>
      </View>
      <View style={styles.detailItem}>
        <Feather name="clock" size={20} color="#007AFF" />
        <View>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailText}>{event.time}</Text>
        </View>
      </View>
      <View style={styles.detailItem}>
        <Feather name="map-pin" size={20} color="#007AFF" />
        <View>
          <Text style={styles.detailLabel}>Venue</Text>
          <Text style={styles.detailText}>{event.venue}</Text>
        </View>
      </View>
    </View>
  );

  const VenueTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Venue Information</Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/300x200?text=Venue+Map' }}
        style={styles.placeholderMap}
      />
      <Text style={styles.sectionTitle}>Venue Details</Text>
      <Text style={styles.sectionText}>
        {event.venue} is a world-class cricket stadium providing the perfect setting for PSL matches. Located in a convenient location, it offers excellent facilities for an unforgettable cricket experience.
      </Text>
      <Text style={styles.sectionTitle}>Getting There</Text>
      <Text style={styles.sectionText}>• By Public Transport: Multiple bus and taxi services available.</Text>
      <Text style={styles.sectionText}>• By Car: Parking available in designated areas around the stadium.</Text>
      <Text style={styles.sectionText}>• By Ride Share: Dedicated pick-up and drop-off points available.</Text>
    </View>
  );

  const renderScene = SceneMap({
    details: DetailsTab,
    venue: VenueTab,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: event.imageUrl }} style={styles.headerImage} />
        <View style={styles.headerOverlay} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('FeaturedEvent')}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.categories}>
            {event.categories.map((category) => (
              <View key={category} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.eventTitle}>{event.title}</Text>
          {event.team1 && event.team2 && (
            <Text style={styles.eventSubtitle}>{event.team1} vs {event.team2}</Text>
          )}
        </View>
      </View>
      <View style={styles.ticketCard}>
        <Text style={styles.sectionTitle}>Tickets</Text>
        <Text style={styles.sectionText}>Starting from</Text>
        <Text style={styles.priceText}>₹{event.price}</Text>
        <Text style={styles.sectionText}>Prices may vary depending on seat selection</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Checkout', { event, bookingDetails: { seats: [], totalPrice: event.price } })}
        >
          <Feather name="ticket" size={20} color="#fff" />
          <Text style={styles.buttonText}>Select Seats</Text>
        </TouchableOpacity>
        <Text style={styles.sectionText}>• Secure checkout</Text>
        <Text style={styles.sectionText}>• Instant ticket delivery</Text>
        <Text style={styles.sectionText}>• Mobile tickets available</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar {...props} style={styles.tabBar} indicatorStyle={styles.tabIndicator} labelStyle={styles.tabLabel} />
        )}
      />
      <Footer />
    </ScrollView>
  );
};

// Checkout Screen
const CheckoutScreen = ({ route, navigation }) => {
  const { event, bookingDetails } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  if (!bookingDetails || !event) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.errorText}>No booking details found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FeaturedEvent')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
        <Footer />
      </ScrollView>
    );
  }

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Booking Successful!',
        text2: 'Your tickets have been emailed to you.',
      });
      navigation.navigate('FeaturedEvent');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('EventDetails', { id: event.id })}
      >
        <Feather name="arrow-left" size={24} color="#000" />
        <Text style={styles.backButtonText}>Back to Seat Selection</Text>
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Checkout</Text>
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={customerName}
          onChangeText={setCustomerName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          value={customerEmail}
          onChangeText={setCustomerEmail}
          keyboardType="email-address"
        />
        <Text style={styles.hintText}>Your tickets will be sent to this email</Text>
      </View>
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <Text style={styles.label}>Card Number</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="1234 5678 9012 3456" />
          <Feather name="credit-card" size={20} color="#666" style={styles.inputIcon} />
        </View>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Expiry Date</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="MM/YY" />
              <Feather name="calendar" size={20} color="#666" style={styles.inputIcon} />
            </View>
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>CVC</Text>
            <TextInput style={styles.input} placeholder="123" />
          </View>
        </View>
      </View>
      <View style={styles.orderCard}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.sectionText}>
          {new Date(event.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })} • {event.time}
        </Text>
        {bookingDetails.seats.map((seat) => (
          <View key={seat.id} style={styles.orderItem}>
            <Text style={styles.sectionText}>Row {seat.row}, Seat {seat.number}</Text>
            <Text style={styles.sectionText}>₹{seat.price}</Text>
          </View>
        ))}
        <View style={styles.orderItem}>
          <Text style={styles.sectionText}>Subtotal</Text>
          <Text style={styles.sectionText}>₹{bookingDetails.totalPrice}</Text>
        </View>
        <View style={styles.orderItem}>
          <Text style={styles.sectionText}>Service Fee</Text>
          <Text style={styles.sectionText}>₹{(bookingDetails.totalPrice * 0.1).toFixed(2)}</Text>
        </View>
        <View style={styles.orderItem}>
          <Text style={styles.sectionText}>Total</Text>
          <Text style={styles.sectionText}>₹{(bookingDetails.totalPrice * 1.1).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCheckout} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Processing...' : 'Complete Purchase'}</Text>
        </TouchableOpacity>
        <Text style={styles.sectionText}>• Secure payment</Text>
        <Text style={styles.sectionText}>• Instant delivery to your email</Text>
        <Text style={styles.sectionText}>• Easy mobile access</Text>
      </View>
      <Footer />
      <Toast />
    </ScrollView>
  );
};

// Navigation Setup
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FeaturedEvent">
        <Stack.Screen name="FeaturedEvent" component={FeaturedEventScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  featuredContainer: { height: 500, borderRadius: 12, overflow: 'hidden', margin: 16 },
  featuredImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  featuredContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, justifyContent: 'flex-end' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  categoryBadge: { backgroundColor: 'rgba(0,122,255,0.8)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  categoryText: { color: '#fff', fontSize: 12 },
  eventTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  eventDescription: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 16 },
  eventDetails: { marginBottom: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailLabel: { fontSize: 14, fontWeight: '600' },
  detailText: { fontSize: 14, color: '#fff', marginLeft: 8 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  priceText: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginLeft: 16 },
  header: { height: '60%', position: 'relative' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  backButton: { position: 'absolute', top: 16, left: 16, padding: 8, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 8 },
  backButtonText: { fontSize: 16, marginLeft: 8 },
  headerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  eventSubtitle: { fontSize: 18, color: 'rgba(255,255,255,0.7)' },
  ticketCard: { backgroundColor: '#f9f9f9', padding: 16, margin: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  tabContent: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  sectionText: { fontSize: 14, color: '#666', marginBottom: 8 },
  placeholderMap: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  tabBar: { backgroundColor: '#fff' },
  tabIndicator: { backgroundColor: '#007AFF' },
  tabLabel: { color: '#000', fontWeight: '600' },
  pageTitle: { fontSize: 28, fontWeight: 'bold', margin: 16 },
  formCard: { backgroundColor: '#f9f9f9', padding: 16, marginHorizontal: 16, marginBottom: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, flex: 1 },
  inputContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  inputIcon: { position: 'absolute', right: 12 },
  hintText: { fontSize: 12, color: '#666', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 0.48 },
  orderCard: { backgroundColor: '#f9f9f9', padding: 16, margin: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  errorText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  footer: { backgroundColor: '#f1f1f1', padding: 16, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#666', marginBottom: 8 },
  footerLink: { fontSize: 14, color: '#007AFF', textDecorationLine: 'underline' },
});