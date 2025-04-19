import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Alert, ScrollView } from 'react-native';
import { PieChart } from 'react-native-svg-charts';

// Dummy Data
const initialTransactions = [
  { id: '1', type: 'expense', amount: 50, category: 'Food', date: '2023-10-01' },
  { id: '2', type: 'income', amount: 2000, category: 'Salary', date: '2023-10-05' },
  { id: '3', type: 'expense', amount: 100, category: 'Transport', date: '2023-10-10' },
];

// Dashboard Screen
const DashboardScreen = ({ navigation }) => {
  const totalIncome = initialTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = initialTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.balance}>Balance: ${balance}</Text>
      <Text>Total Income: ${totalIncome}</Text>
      <Text>Total Expenses: ${totalExpenses}</Text>
      <Button
        title="View Transactions"
        onPress={() => navigation.navigate('TransactionsList')}
      />
      <Button
        title="Add Expense"
        onPress={() => navigation.navigate('AddExpense')}
      />
      <Button
        title="Reports & Analytics"
        onPress={() => navigation.navigate('ReportsAnalytics')}
      />
    </View>
  );
};

// Add Expense Screen
const AddExpenseScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleAddExpense = () => {
    if (!amount || !category || !date) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    const newTransaction = {
      id: String(Math.random()),
      type: 'expense',
      amount: parseFloat(amount),
      category,
      date,
    };
    initialTransactions.push(newTransaction);
    Alert.alert('Success', 'Expense added successfully.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Add Expense" onPress={handleAddExpense} />
    </View>
  );
};

// Transactions List Screen
const TransactionsListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <FlatList
        data={initialTransactions}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>{item.category}</Text>
            <Text>${item.amount}</Text>
            <Text>{item.date}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Reports & Analytics Screen
const ReportsAnalyticsScreen = () => {
  const expenseData = initialTransactions.filter((t) => t.type === 'expense');
  const categoryTotals = expenseData.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map((category) => ({
    key: category,
    value: categoryTotals[category],
    svg: { fill: `#${Math.floor(Math.random() * 16777215).toString(16)}` },
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reports & Analytics</Text>
      <PieChart
        style={{ height: 200 }}
        data={chartData}
      />
    </ScrollView>
  );
};

// Budget Settings Screen
const BudgetSettingsScreen = () => {
  const [monthlyLimit, setMonthlyLimit] = useState('');

  const handleSaveLimit = () => {
    if (!monthlyLimit) {
      Alert.alert('Error', 'Please enter a monthly limit.');
      return;
    }
    Alert.alert('Success', 'Monthly limit saved.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Settings</Text>
      <TextInput
        style={styles.input}
        placeholder="Monthly Spending Limit"
        keyboardType="numeric"
        value={monthlyLimit}
        onChangeText={setMonthlyLimit}
      />
      <Button title="Save Limit" onPress={handleSaveLimit} />
    </View>
  );
};

// Profile & Theme Settings Screen
const ProfileSettingsScreen = () => {
  const [theme, setTheme] = useState('light');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    Alert.alert('Theme Changed', `Theme set to ${newTheme}.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Theme Settings</Text>
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
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="TransactionsList" component={TransactionsListScreen} />
        <Stack.Screen name="ReportsAnalytics" component={ReportsAnalyticsScreen} />
        <Stack.Screen name="BudgetSettings" component={BudgetSettingsScreen} />
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
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  balance: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  transactionItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
    borderRadius: 8,
  },
});