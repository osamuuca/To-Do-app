import { FlatList } from "react-native-gesture-handler";
import { Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { use, useEffect, useState } from "react";
import { Checkbox } from 'expo-checkbox'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type ToDoType = {
  id: number;
  title: string;
  isFinished: boolean;
}


export default function Index() {

  const toDoData = [
    {
      id: 1 ,
      title: "Lavar a louça" ,
      isFinished: true,
    },
    {
      id: 2 ,
      title: "Fazer compras",
      isFinished: false, 
    },
    {
      id:  3,
      title: "Passear com a cachorra",
      isFinished: false,
    },
    {
      id: 4,
      title:"Estudar react native" ,
      isFinished:false,
    }
  ]

  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [oldTodos, setOldTodos] = useState<ToDoType[]>([]);
  const [toDoText, setToDoText] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() =>{
    const getToDoItems = async() => {
      try {
        const items = await AsyncStorage.getItem('todos');
        if(items !== null){
          setTodos(JSON.parse(items));
          setOldTodos(JSON.parse(items))
        }
      }
      catch(error){
        console.log(error);
      }
    };
    getToDoItems();
  }, []);

  const handleClearSearch = () => {
    setSearchText('');
  };
  const addTodo = async() =>{

    try {

      const newTodo = {
        id: todos.length + 1,
        title: toDoText,
        isFinished: false
      };
      todos.push(newTodo);
      setTodos([...todos]);
      setOldTodos([...todos]);
      //Adição assíncrona local
      //Adciona {todos} no local storage como um item de id 'todos' que foi definido na assinatura do setItem()
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
      setToDoText('');
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  const deleteToDoItem = async(id: number) => {
    try {
      const updatedListOfTodos = todos.filter((todo) => todo.id !== id);
      await AsyncStorage.setItem('todos', JSON.stringify(updatedListOfTodos))
      setTodos(updatedListOfTodos);
      setOldTodos(updatedListOfTodos);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDone = async(id: number)=>{
    try{
      const checkedItems = todos.map((todo => {
        if(todo.id === id){
          todo.isFinished= !todo.isFinished;
         }
          return todo;
        }));
      await AsyncStorage.setItem('todos', JSON.stringify(checkedItems));
      setTodos(
        checkedItems
      );
      setOldTodos(
        checkedItems
      );
    }
    catch(e){
      console.log(e);
    }
  }
  const onSearch = (query: string) =>{
    if(query == ''){
      setTodos(oldTodos);
    }
    else{

      const filtered = todos.filter(
        (todo) => todo.title.toLowerCase()
        .includes(query.toLowerCase())
      );
        setTodos(filtered);
    }
  }

  useEffect(()=>{
    onSearch(searchText);
  },[searchText]
)
  return (
    <SafeAreaView
      style={
        styles.container
      }
          >
      <View style = {styles.header}>

        <TouchableOpacity onPress={() => {alert('Clicked!!')}}>
          <Ionicons name="menu" size={24} color={'#333'} />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{}}>
          <Image source={require('../assets/images/user-profile.png')} 
          style={{width: 40, height: 40, borderRadius: 20}}/>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
          <Ionicons name="search" size={24} color={'#333'} />
          <TextInput style={styles.searchInput}
          value={searchText}
          onChangeText={(text) => setSearchText(text)} 
          placeholder="Pesquisar"></TextInput>
          {searchText.length > 0 && ( 
        <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={'#888'} />
        </TouchableOpacity>
      )}
      </View>
      <FlatList 
        data={[...todos].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ToDoItemComponent todo={item} deleteToDoItem={deleteToDoItem} handleDone={handleDone}/>
        )}
        >
      </FlatList>


      <KeyboardAvoidingView behavior="padding"
      keyboardVerticalOffset={10}
      style={styles.footer}>
        <TextInput style={styles.newToDoInput}
        autoCorrect={false} 
        onChangeText={(text)=> setToDoText(text)}
        value={toDoText}
        placeholder="Criar Tarefa"></TextInput>
        <TouchableOpacity style={styles.addTaskButton} onPress={()=>addTodo()}>
          <Ionicons name="add" size={24} color={'#333'}/>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ToDoItemComponent = ({
  todo,
  deleteToDoItem,
  handleDone
} : {
  todo: ToDoType;
  deleteToDoItem: (id: number) => void;
  handleDone: (id: number) => void;
} ) => {
  return (
  
  <View style={styles.toDoListItem}>
    <View style={styles.toDoInfoListItem}>
      <Checkbox value={todo.isFinished} 
        color={todo.isFinished ? '#c7f91a' : '#333'}
        onValueChange={() => handleDone(todo.id)} />
      <Text style={[styles.toDoText, todo.isFinished && {textDecorationLine: "line-through"}]} >{todo.title}</Text>
    </View>
    <TouchableOpacity
      onPress={()=> {
        deleteToDoItem(todo.id);
        alert('Item deletado! ' + todo.title);
        }}>
      <Ionicons name="trash" size={24} color={'red'}/>
    </TouchableOpacity>
  </View>)
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5'
  },
  header:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  searchBar:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    gap: 4,
    marginBottom: 20
  },
  searchInput:{
    flex: 1,
    color: '#333',
    fontSize: 16
  },
  clearButton: {
    marginLeft: 8,
    padding: 2, 
  },
  toDoListItem:{
    backgroundColor:'#fff',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between'
  },
  toDoInfoListItem:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8
  },
  toDoText:{
    fontSize: 16,
    color: '#333'
  },
  footer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newToDoInput:{
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    fontSize: 16,
    borderRadius: 8,
    color: '#333',
  },
  addTaskButton:{
    backgroundColor: '#c7f91a',
    padding: 12,
    borderRadius: 16,
    marginLeft: 20
  }
});
