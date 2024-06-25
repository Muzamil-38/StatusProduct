import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {Checkbox} from 'react-native-paper';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

function App(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectSet, setSelectSet] = useState<boolean>(false);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  useEffect(() => {
    axios
      .get('https://fakestoreapi.com/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log('Selected product IDs:', selectedProductIds);
  }, [selectedProductIds]);

  const handleSelectAll = () => {
    if (!selectSet) {
      setSelectedProductIds(products.map(product => product.id));
    } else {
      setSelectedProductIds([]);
    }
    setSelectSet(!selectSet);
  };

  const handleClearSelection = () => {
    setSelectedProductIds([]);
  };

  const toggleSelectProduct = (productId: number) => {
    setSelectedProductIds(prevSelected => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter(id => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10,
        }}>
        <TouchableOpacity onPress={handleSelectAll}>
          <Text>{selectSet ? 'Deselect All' : 'Select All'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClearSelection}>
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View key={item.id} style={styles.itemContainer}>
            {selectSet && (
              <Checkbox
                status={
                  selectedProductIds.includes(item.id) ? 'checked' : 'unchecked'
                }
                onPress={() => toggleSelectProduct(item.id)}
              />
            )}
            <Image source={{uri: item.image}} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <Text style={styles.description}>{item.category}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
  description: {
    fontSize: 12,
    color: '#555',
  },
});

export default App;
