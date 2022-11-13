import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import MultiSelect from 'react-native-multiple-select';
import * as Animatable from "react-native-animatable"
import { style, primaryColor } from "../../../assets/styles/MainStyle";

import { useNavigation } from "@react-navigation/native"
import BottomMenu from "../Constants/BottomMenu";

// LogBox.ignoreLogs(['new NativeEventEmitter'])

export default function UserController() {

  const navigation = useNavigation()

  const DATA = [
    { id: 1, name: 'Especialidade 1' },
    { id: 2, name: 'Especialidade 2' },
    { id: 3, name: 'Especialidade 3' },
    { id: 4, name: 'Especialidade 4' },
  ];

  const [selectedItems, setSelectedItems] = useState([]);
 
  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    for (let i = 0; i < selectedItems.length; i++) {
      var tempItem = DATA.find(item => item.id === selectedItems[i]);
    }
  }

  return (
    <View style={style.container}>

        <Animatable.View animation="fadeInDown" delay={100} style={style.headerCard}>
          <Text style={style.headerCardTitle}>Gerenciar usuários</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInRight" delay={400} style={style.card}>

          <Text style={style.cardLabel}>Nome</Text>
          <TextInput style={style.textInput}></TextInput>

          <Text style={style.cardLabel}>Email</Text>
          <TextInput style={style.textInput}></TextInput>
  
          <MultiSelect
            hideTags
            items={DATA}
            uniqueKey="id"
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Escolher especialidades"
            searchInputPlaceholderText="Pesquisar..."
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor={primaryColor}
            selectedItemIconColor={primaryColor}
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor={primaryColor}
            submitButtonText="Finalizar"
          />

          <TouchableOpacity style={[style.cardButton, style.centralizeContent, localStyle.submitButton]}>
            <Text style={style.cardButtonText}>Adicionar</Text>
          </TouchableOpacity>

        </Animatable.View>
        <BottomMenu />
    </View>
  );
}

const localStyle = StyleSheet.create({
  submitButton: { marginTop: 20 }
})