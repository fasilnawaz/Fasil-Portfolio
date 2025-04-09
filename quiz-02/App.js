import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Mock data for Disney movies
const mockMovies = [
  {
    id: 1,
    title: 'The Lion King',
    year: 1994,
    image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTv0REMOInqkdMG-8AbTQIVTv9bmlN6O6CM0yh12hG_uQ_U66Q2k0aQVj2ajafAYWOrWUJt3A',
    description: 'A young lion prince is cast out of his pride by his cruel uncle, who claims he was responsible for his father\'s death. The lonely prince joins up with a meerkat and warthog to survive in the wilderness.',
    rating: '8.5',
    cast: 'Matthew Broderick, Jeremy Irons, James Earl Jones',
    youtubeUrl: 'https://www.youtube.com/embed/4sj1MT05lAA'
  },
  {
    id: 2,
    title: 'Frozen',
    year: 2013,
    image: 'https://lumiere-a.akamaihd.net/v1/images/p_frozen_18373_3131259c.jpeg',
    description: 'When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man, his playful reindeer, and a snowman to change the weather condition.',
    rating: '7.4',
    cast: 'Kristen Bell, Idina Menzel, Jonathan Groff',
    youtubeUrl: 'https://www.youtube.com/embed/TbQm5doF_Uc'
  },
  {
    id: 3,
    title: 'Moana',
    year: 2016,
    image: 'https://lumiere-a.akamaihd.net/v1/images/p_moana_20530_214883e3.jpeg',
    description: 'In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana\'s island, she answers the Ocean\'s call to seek out the Demigod to set things right.',
    rating: '7.6',
    cast: 'Auli\'i Cravalho, Dwayne Johnson, Rachel House',
    youtubeUrl: 'https://www.youtube.com/embed/LKFuXETZUsI'
  },
];

// Home Screen Component
function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMovies(mockMovies);
      setLoading(false);
    }, 1000);
  }, []);

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => navigation.navigate('MovieDetail', { movie: item })}
    >
      <Image source={{ uri: item.image }} style={styles.movieImage} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieYear}>{item.year}</Text>
        <Text style={styles.movieDescription} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#1e88e5" />
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

// Characters Screen Component
function CharactersScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCharacters = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.disneyapi.dev/character?page=${pageNum}`);
      setCharacters(prev => [...prev, ...response.data.data]);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(page);
  }, [page]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const renderCharacterItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.characterCard}
      onPress={() => navigation.navigate('CharacterDetail', { character: item })}
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.characterImage} 
      />
      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{item.name}</Text>
        {item.films && item.films.length > 0 && (
          <Text style={styles.characterFilms} numberOfLines={1}>
            Films: {item.films.slice(0, 3).join(', ')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        renderItem={renderCharacterItem}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          loading && page > 1 ? <ActivityIndicator size="small" color="#1e88e5" /> : null
        )}
      />
    </View>
  );
}

// Search Screen Component
function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timer = setTimeout(() => {
        searchCharacters();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const searchCharacters = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://api.disneyapi.dev/character?name=${searchQuery}`);
      setResults(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error searching characters:', error);
      setLoading(false);
    }
  };

  const renderResultItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => navigation.navigate('CharacterDetail', { character: item })}
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.resultImage} 
      />
      <Text style={styles.resultName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Disney characters..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e88e5" />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery.length > 2 ? 'No results found' : 'Start typing to search'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

// Watch Screen Component
function WatchScreen({ route, navigation }) {
  const movie = route.params?.movie || {};
  const youtubeUrl = movie.youtubeUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.title || 'Disney Movie'}</Text>
      
      <View style={styles.videoContainer}>
        {/* Using WebView directly in Snack might require additional setup */}
        <View style={styles.videoPlaceholder}>
          <Text>Video Player Placeholder</Text>
          <Text>(In a real app, this would be a WebView playing YouTube)</Text>
        </View>
      </View>

      <View style={styles.movieInfo}>
        <Text style={styles.description}>
          {movie.description || 'Enjoy this Disney movie!'}
        </Text>
      </View>

      <View style={styles.suggestions}>
        <Text style={styles.sectionTitle}>More Disney Movies</Text>
        <TouchableOpacity style={styles.suggestionCard}>
          <Image 
            source={{ uri: 'https://lumiere-a.akamaihd.net/v1/images/p_frozen_18373_3131259c.jpeg' }} 
            style={styles.suggestionImage} 
          />
          <Text style={styles.suggestionTitle}>Frozen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Character Detail Screen Component
function CharacterDetailScreen({ route }) {
  const { character } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: character.imageUrl || 'https://via.placeholder.com/300' }} 
          style={styles.characterImageLarge}
        />
        <Text style={styles.characterNameLarge}>{character.name}</Text>
      </View>

      <View style={styles.detailsSection}>
        {character.films && character.films.length > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Films:</Text>
            <Text style={styles.detailValue}>{character.films.join(', ')}</Text>
          </View>
        )}

        {character.tvShows && character.tvShows.length > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>TV Shows:</Text>
            <Text style={styles.detailValue}>{character.tvShows.join(', ')}</Text>
          </View>
        )}

        {character.videoGames && character.videoGames.length > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Video Games:</Text>
            <Text style={styles.detailValue}>{character.videoGames.join(', ')}</Text>
          </View>
        )}

        {character.allies && character.allies.length > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Allies:</Text>
            <Text style={styles.detailValue}>{character.allies.join(', ')}</Text>
          </View>
        )}

        {character.enemies && character.enemies.length > 0 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Enemies:</Text>
            <Text style={styles.detailValue}>{character.enemies.join(', ')}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Movie Detail Screen Component
function MovieDetailScreen({ route, navigation }) {
  const { movie } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: movie.image || 'https://via.placeholder.com/400x600' }} 
        style={styles.moviePoster}
      />
      
      <View style={styles.content}>
        <Text style={styles.titleLarge}>{movie.title}</Text>
        <Text style={styles.year}>{movie.year}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {movie.rating || '8.5'}/10</Text>
        </View>

        <Text style={styles.description}>
          {movie.description || 'No description available.'}
        </Text>

        <View style={styles.castSection}>
          <Text style={styles.sectionTitle}>Cast</Text>
          <Text style={styles.cast}>
            {movie.cast || 'Voice cast not specified'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.watchButton}
          onPress={() => navigation.navigate('Watch', { movie })}
        >
          <Text style={styles.watchButtonText}>Watch Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Navigation Setup
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const CharactersStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const WatchStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <HomeStack.Screen name="Watch" component={WatchScreen} />
    </HomeStack.Navigator>
  );
}

function CharactersStackScreen() {
  return (
    <CharactersStack.Navigator>
      <CharactersStack.Screen name="CharactersMain" component={CharactersScreen} options={{ headerShown: false }} />
      <CharactersStack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
    </CharactersStack.Navigator>
  );
}

function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
    </SearchStack.Navigator>
  );
}

function WatchStackScreen() {
  return (
    <WatchStack.Navigator>
      <WatchStack.Screen name="WatchMain" component={WatchScreen} options={{ headerShown: false }} />
    </WatchStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Characters') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Watch') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1e88e5',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#1e88e5',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Characters" component={CharactersStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SearchStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Watch" component={WatchStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 10,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  movieImage: {
    width: 100,
    height: 150,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  movieInfo: {
    flex: 1,
    padding: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  movieYear: {
    color: '#666',
    marginBottom: 5,
  },
  movieDescription: {
    color: '#444',
  },
  characterCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  characterInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  characterFilms: {
    color: '#666',
    fontSize: 14,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  resultName: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  videoContainer: {
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  videoPlaceholder: {
    padding: 20,
    alignItems: 'center',
  },
  movieInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestions: {
    marginTop: 10,
  },
  suggestionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionImage: {
    width: 60,
    height: 80,
    borderRadius: 4,
    marginRight: 10,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  characterImageLarge: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 15,
  },
  characterNameLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailsSection: {
    backgroundColor: 'white',
    padding: 15,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#1e88e5',
  },
  detailValue: {
    fontSize: 16,
    lineHeight: 22,
  },
  moviePoster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  titleLarge: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  year: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    color: '#ff9800',
  },
  castSection: {
    marginBottom: 20,
  },
  cast: {
    fontSize: 16,
    lineHeight: 22,
  },
  watchButton: {
    backgroundColor: '#1e88e5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  watchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}