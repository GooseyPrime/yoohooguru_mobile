/**
 * Home screen - Skills feed and nearby users
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/lib/auth-context';
import { skillsApi } from '@yoohoo-guru/sdk';

export default function HomeScreen() {
  const { user } = useAuth();

  // Fetch skills feed
  const { data: skillsData, isLoading } = useQuery({
    queryKey: ['skills', 'browse'],
    queryFn: () => skillsApi.browseSkills({ limit: 20 }),
  });

  const skills = skillsData?.data?.skills || [];

  const renderSkillCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.skillCard}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillName}>{item.name}</Text>
        <Text style={styles.skillCategory}>{item.category}</Text>
      </View>
      <Text style={styles.skillStats}>
        {item.teachersCount} teachers • {item.learnersCount} learners
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.displayName || 'there'}!</Text>
            <Text style={styles.subtitle}>Discover skills in your community</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle" size={32} color="#007AFF" />
            <Text style={styles.actionText}>Offer Skill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="search" size={32} color="#007AFF" />
            <Text style={styles.actionText}>Find Skills</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people" size={32} color="#007AFF" />
            <Text style={styles.actionText}>Browse Gurus</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Skills</Text>
          {isLoading ? (
            <Text style={styles.loading}>Loading...</Text>
          ) : (
            <FlatList
              data={skills}
              renderItem={renderSkillCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.skillsList}
            />
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              Welcome to YooHoo Guru! Start by adding your skills or browsing what others offer.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  loading: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  skillsList: {
    paddingHorizontal: 20,
  },
  skillCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
  },
  skillHeader: {
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  skillCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  skillStats: {
    fontSize: 12,
    color: '#999',
  },
  activityCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});