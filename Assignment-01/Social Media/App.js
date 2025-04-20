import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet } from 'react-native';

// Add these lines to initialize React Navigation dependencies
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();

const Stack = createStackNavigator();

// Dummy data for posts
const posts = [
  { id: '1', user: 'User1', caption: 'This is a post', image: 'https://via.placeholder.com/150' },
  { id: '2', user: 'User2', caption: 'Another post', image: 'https://via.placeholder.com/150' },
];

// Login & Signup Screen
const AuthScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Media App</Text>
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <Button title="Login" onPress={() => navigation.navigate('Feed')} />
      <Button title="Sign Up" onPress={() => navigation.navigate('Feed')} />
    </View>
  );
};

// Feed Screen
const FeedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.user}>{item.user}</Text>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.caption}>{item.caption}</Text>
            <View style={styles.actions}>
              <Button title="Like" onPress={() => {}} />
              <Button title="Comment" onPress={() => {}} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

// Create Post Screen
const CreatePostScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Write a caption..." />
      <Button title="Upload Image" onPress={() => {}} />
      <Button title="Post" onPress={() => navigation.navigate('Feed')} />
    </View>
  );
};

// Profile Screen
const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.bio}>Bio: This is a sample bio.</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />
      <Button title="Follow" onPress={() => {}} />
    </View>
  );
};

// Chat Screen
const ChatScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      <TextInput style={styles.input} placeholder="Type a message..." />
      <Button title="Send" onPress={() => {}} />
    </View>
  );
};

// Notifications Screen
const NotificationsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text>Friend request from User1</Text>
      <Text>User2 liked your post</Text>
    </View>
  );
};

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  post: {
    marginBottom: 20,
  },
  user: {
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  caption: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  bio: {
    fontSize: 16,
    marginBottom: 20,
  },
});