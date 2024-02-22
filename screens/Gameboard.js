import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../styles/styles';

let board = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;


export default function Gameboard() {

  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState('');
  const [selectedDices, setSelectedDices] = 
    useState(new Array(NBR_OF_DICES).fill(false));
  const [selectedValues, setSelectedValues] = 
    useState(new Array(6).fill(null));

  const row = [];
  for (let i = 0; i < NBR_OF_DICES; i++) {
    row.push(
      <Pressable 
          key={"row" + i}
          onPress={() => selectDice(i)}>
        <MaterialCommunityIcons
          name={board[i]}
          key={"row" + i}
          size={50} 
          color={getDiceColor(i)}>
        </MaterialCommunityIcons>
      </Pressable>
    );
  }

  const diceValues = [];
  for (let i = 0; i < 6; i++) {
    diceValues.push(
        <View
        key={i}
        >
        <Text style={styles.gameinfo}>{
            selectedValues[i] ? selectedValues[i] : '0'
          }</Text>
          <Text style={styles.gameinfo}>{`${i + 1}`}</Text>
          </View>
    )
  }

  useEffect(() => {
    if (nbrOfThrowsLeft === NBR_OF_THROWS) {
      setStatus('Game has not started');
    }
    if (nbrOfThrowsLeft < 0) {
      setNbrOfThrowsLeft(NBR_OF_THROWS-1);
    }
  }, [nbrOfThrowsLeft]);

  function getDiceColor(i) {
    if (board.every((val, i, arr) => val === arr[0])) {
      return "orange";
    }
    else {
      return selectedDices[i] ? "black" : "steelblue";
    }
  }


  const selectDice = (i) => {
    // Check if all throws for this turn have been used
    if (nbrOfThrowsLeft === 0) {
      setStatus('All throws for this turn have been used.');
      return;
    }

    // Check if a value has already been selected for any dice
    if (selectedValues.some(value => value !== null)) {
      setStatus('A value has already been selected for another dice.');
      return;
    }

    let dices = [...selectedDices];
    dices[i] = !selectedDices[i];
    setSelectedDices(dices);

    // Get the spot count of the selected dice
    const spotCount = parseInt(board[i].split("-")[1]);

    // Check if the value should be set for this dice
    if (nbrOfThrowsLeft === 1) {
      setSelectedValues(prevValues => {
        const newValues = [...prevValues];
        newValues[i] = spotCount;
        return newValues;
      });
      setStatus(`Value ${spotCount} has been selected for dice ${i + 1}.`);
    }
  }

  const throwDices = () => {
    for (let i = 0; i < NBR_OF_DICES; i++) {
      if (!selectedDices[i]) {
        let randomNumber = Math.floor(Math.random() * 6 + 1);
        board[i] = 'dice-' + randomNumber;
      }
    }
    setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
  }
  
  return(
    <View style={styles.gameboard}>
      <View style={styles.flex}>{row}</View>
      <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.gameinfo}>{status}</Text>
      <Pressable style={styles.button}
        onPress={() => throwDices()}>
          <Text style={styles.buttonText}>
            Throw dices
          </Text>
      </Pressable>
      <View style={styles.flex}>{diceValues}</View>
    </View>
  )
}