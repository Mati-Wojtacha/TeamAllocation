<template>
  <div class="table-container">
    <div class="left">
      <form @submit.prevent="fetchData">
        <label for="teamId">Podaj liczbę graczy, aby podzielić ich na 2 drużyny:</label>
        <input class="form-control" type="number" steps="1" id="teamId" v-model="teamId" required @input="handleInput($event)" />
        <button class="btn btn-primary" type="submit">Pobierz dane</button>
      </form>

      <div v-if="isLoading">Ładowanie...</div>

      <div v-if="error">{{ error }}</div>

      <div v-if="data">
        <MatchForm :data="data" :playerNames="playerNames" :results="results"></MatchForm>
      </div>
    </div>

    <div class="right">
      <div v-if="data">
        <Summary :playerNames="playerNames" :data="data" :results="results"></Summary>
      </div>  
    </div>
  </div>
</template>

<script>
import { blockNegativeNumbersAndText } from '../components/BlockNumbersAndText';
import MatchForm from "../components/MatchForm.vue";
import Summary from "../components/Summary.vue";

export default {
  components: {
    Summary,
    MatchForm,
  },
  data() {
    return {
      teamId: 0,
      isLoading: false,
      error: null,
      data: null,
      results: [],
      emailData: [],
      playerNames: [],
    };
  },
  methods: {
    handleInput(event) {
    this.addPlayer(this.teamId);
    this.onInputChange(event);
  },
    blockNegativeNumbersAndText,
    onInputChange(event) {
      this.blockNegativeNumbersAndText(event);
    },
    fetchData() {
      this.isLoading = true;
      this.error = null;
      this.data = null;

      const url = `http://127.0.0.1:8080/teamsString/${this.playerNames.join(",")}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.isLoading = false;
          this.data = data;
          for (let i = 0; i < data[0].length; i++) {
            this.results.push({ result1: null, result2: null });
          }
        })
        .catch(error => {
          this.isLoading = false;
          this.error = "Wystąpił błąd podczas pobierania danych.";
          console.error(error);
        });
    },
    addPlayer(teamId) {
      this.playerNames = [];
      for (let i = 1; i <= teamId; i++) {
        this.playerNames.push(`Player${i}`);
      }
    },
    updateResults(index) {
      const result1 = parseInt(document.getElementById('result1' + index).value);
      const result2 = parseInt(document.getElementById('result2' + index).value);

      this.results[index] = {
        result1: result1,
        result2: result2
      };
    },
  }
};
</script>
