import React from "react";
import api from './services/api'

import {
  SafeAreaView,
  View,
  ScrollView,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from 'react';

export default function App() {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data)
    })
  }, [])

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: 'New Repository',
      url: 'new url',
      techs: ["new tech", "..."]
    })

    const repository = response.data

    setRepositories([...repositories, repository])
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`)

    const newRepositories = repositories.filter(
      repository => repository.id !== id
    )
    
    setRepositories(newRepositories)
  }

  async function handleLikeRepository(id) {
    // Implement "Like Repository" functionality
    const response = await api.post(`repositories/${id}/like`)

    const liked = response.data

    const newRepositories = repositories.map(repository => {
      if (repository.id === id) {
        return liked
      } else {
        return repository
      }
    })

    setRepositories(newRepositories) 
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
      <View style={styles.addDeleteView}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddRepository()}
        >
          <Text style={styles.buttonText}>
            Adicionar Repositorio Estatico
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList 
        style={styles.container}
        data={repositories}
        keyExtractor={repository => repository.id}
        renderItem={({ item: repository}) => (
          <View style={styles.repositoryContainer}>
          <Text style={styles.repository}>{repository.title}</Text>

          
            <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>
                ))}
            </View>
          

          <View style={styles.likesContainer}>
            <Text
              style={styles.likeText}
              // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
              testID={`repository-likes-${repository.id}`}
            >
              {repository.likes} curtidas
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleLikeRepository(repository.id)}
            // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
            testID={`like-button-${repository.id}`}
          >
            <Text style={styles.buttonText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={styles.button}
          onPress={() => handleRemoveRepository(repository.id)}
        >
          <Text style={styles.buttonText}>Remover</Text>
        </TouchableOpacity>
        </View>
        )}  
      />
        
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  addDeleteView: {
    flex: 0.2,
    flexDirection: "row",
  },
});
