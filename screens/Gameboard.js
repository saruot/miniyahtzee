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
  const [scoreSet, setScoreSet] = useState(new Array(6).fill(false)); // Track if score is set for each value
  const [hasScoreBeenSet, setHasScoreBeenSet] = useState(false)


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
      <Pressable 
        key={i}
        onPress={() => setScore(i)}>
        <Text style={styles.gameinfo}>{selectedValues[i] !== null ? 'X' : ''}</Text>
        <Text style={styles.gameinfo}>{i + 1}</Text>
      </Pressable>
    );
  }

  const setScore = (value) => {
    if (nbrOfThrowsLeft === 0) {
      setStatus('You must set a score during the last throw.');
    }

    if (selectedValues[value] !== null || scoreSet[value]) {
      setStatus(`Score already set for value ${value + 1}.`);
      return;
    }

    setSelectedValues(prevValues => {
      const newValues = [...prevValues];
      newValues[value] = calculateScore(value + 1); // Calculate score for the value
      return newValues;
    });

    setScoreSet(prevScores => {
      const newScores = [...prevScores];
      newScores[value] = true;
      return newScores;
    });

    setHasScoreBeenSet(true); // Set score as set for this turn
    setStatus(`Score ${calculateScore(value + 1)} set for value ${value + 1}.`);
  }

  const calculateScore = (value) => {
    // Calculate and return score for the given value
    return value * 10;
  }

  useEffect(() => {
    if (nbrOfThrowsLeft === NBR_OF_THROWS) {
      setHasScoreBeenSet(true)
      setStatus('Game has not started');
    }
    if (nbrOfThrowsLeft < 0) {
      setNbrOfThrowsLeft(NBR_OF_THROWS-1);
      setHasScoreBeenSet(false); // Reset scoreSet for the next turn
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
    const spotCount = parseInt(board[i].split("-")[1]);

    // Check if any dice has been previously selected
    if (selectedDices.some((dice, index) => dice && index !== i && selectedValues[index] === spotCount)) {
      setStatus('You can only select dice with the same value as the previously selected one.');
      return;
  }
  if (selectedDices.some((dice, index) => dice && index !== i)) {
    // Check if the selected value matches the value of the previously selected dice
    const selectedValue = selectedValues.find(value => value !== null);
    if (selectedValue !== spotCount && spotCount) {
        setStatus('You can only select dice with the same value as the previously selected one.');
        return;
    }
}

    let dices = [...selectedDices];
    dices[i] = !selectedDices[i];
    setSelectedDices(dices);
}

  const throwDices = () => {
   
    if (!hasScoreBeenSet) {
      setStatus('You must set a score for a value before next turn');
      return;
    }
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