import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

// Mock API data (static JSON)
const mockTransactions = [
  { id: 1, category: 'Salary', amount: 3000, type: 'income', date: '2023-10-01' },
  { id: 2, category: 'Rent', amount: 1000, type: 'expense', date: '2023-10-02' },
  { id: 3, category: 'Groceries', amount: 200, type: 'expense', date: '2023-10-03' },
  { id: 4, category: 'Freelance', amount: 500, type: 'income', date: '2023-10-04' },
  { id: 5, category: 'Utilities', amount: 150, type: 'expense', date: '2023-10-05' },
];

const DashboardScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchTransactions = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTransactions(mockTransactions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Calculate totals
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

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
      <Text style={styles.header}>Expense Tracker</Text>

      {/* Summary Section */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total Income: ${totalIncome.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Total Expenses: ${totalExpenses.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Balance: ${balance.toFixed(2)}</Text>
      </View>

      {/* Transactions List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text style={styles.transactionCategory}>{item.category}</Text>
            <Text
              style={[
                styles.transactionAmount,
                item.type === 'income' ? styles.income : styles.expense,
              ]}
            >
              {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
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
  summary: {
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
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
  },
  transaction: {
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
  transactionCategory: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 14,
  },
  income: {
    color: 'green',
  },
  expense: {
    color: 'red',
  },
  transactionDate: {
    fontSize: 12,
    color: '#aaa',
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

export default DashboardScreen;