<template>
  <AddPlayerForm @add-player="addPlayer" />
    <div class="table-container">
        <div class="left">
          <PlayerList ref="playerList" :playerNames="playerNames" @edit-player="editPlayer" @delete-player="deletePlayer" />
            <button class="btn btn-primary" @click="fetchData" v-if="playerNames.length >= 2">Pobierz dane</button>
        
            <div v-if="isLoading">Ładowanie...</div>
            <div v-if="error">{{ error }}</div>
        
            <div v-if="data">
                <MatchForm :data="data" :playerNames="playerNames" :results="results"></MatchForm>
            </div>
        </div>

        <div class="right">
            <div v-if="data">
                <Email :playerNames="playerNames" :emailData="emailData" :data="data" :results="results"/>
                <Summary :playerNames="playerNames" :data="data" :results="results" ></Summary>
                <button class="btn btn-primary" @click="saveMatches" v-if="user != null" :disabled="matchesSaved">Zapisz zestawienie meczy w bazie</button>
            </div>
        </div>
    </div>
</template>
  
  <script>
  import AddPlayerForm from "../components/AddPlayerForm.vue";
  import PlayerList from "../components/PlayerList.vue";
  import MatchForm from "../components/MatchForm.vue";
  import Summary from "../components/Summary.vue";
  import Email from "../components/Email.vue";
  import { mapState } from 'vuex';
  import axios from 'axios';


  export default {
    components: {
      AddPlayerForm,
      PlayerList,
      MatchForm,
      Summary,
      Email,
    },
    computed: {
    ...mapState(['user']),
  },
    data() {
      return {
        matchesSaved: false,  
        playerNames: [],
        isLoading: false,
        error: null,
        data: null,
        results: [],
        emailData: [],
      };
    },
    methods: {
      addPlayer(newPlayerName) {
        if (newPlayerName) {
          if (this.playerNames.includes(newPlayerName)) {
            this.error = "Gracz o takiej nazwie już istnieje.";
          } else {
            this.playerNames.push(newPlayerName);
            this.emailData.push({ email: "" });
            this.error = null;
          }
        }
      },
      editPlayer(index) {
        const newName = prompt("Wprowadź nową nazwę gracza", this.playerNames[index]);
        if (newName && newName !== this.playerNames[index]) {
          if (this.playerNames.includes(newName)) {
            this.error = "Gracz o takiej nazwie już istnieje.";
          } else {
            this.playerNames[index] = newName;
            this.error = null;
          }
        }
      },
      deletePlayer(index) {
        this.playerNames.splice(index, 1);
        this.results.splice(index, 1);
        this.emailData.splice(index, 1);
      },

      getSummaryMessage() {
        const summaryElement = document.getElementById("summary");
        return summaryElement.textContent.trim();
      },
      sendMatchDataToServer(messageToSend, token) {
        const match = {
          "match": messageToSend,
        };

        axios.post('http://localhost:8080/api/matches/create', match, {
          headers: {
            'Authorization': token
          }
        })
        .then(response => {
          console.log(response.status);
          if (response.status >= 200 && response.status < 299) {
            console.log(response.data);
            this.matchesSaved = true;
            alert('Pomyślnie zapisano mecz w bazie');
          } else {
            throw new Error('Błąd żądania: ' + response.status);
          }
        })
        .catch(error => {
          console.error('Wystąpił błąd:', error);
        });
      },
      saveMatches() {
    let matches = [];

    for (let i = 0; i < this.data[0].length; i++) {
      const match = {
        match: i + 1,
        team1: this.data[0][i],
        team2: this.data[1][i],
        result: {
          team1: this.results[i].result1,
          team2: this.results[i].result2
        }
      };

      matches.push(match);
    }

    const summaryMessage = this.getSummaryMessage();

    const matchData = {
      matches: matches,
      summary: summaryMessage
    };

    const jsonData = JSON.stringify(matchData);

    console.log(jsonData);
    console.log(this.user.id);
    const token = window.localStorage.getItem('token');

    this.sendMatchDataToServer(jsonData, token);
  },
      fetchData() {
        this.$refs.playerList.showList=false;
        console.log(PlayerList.showList);
        this.isLoading = true;
        this.error = null;
        this.data = null;
  
        const url = `http://127.0.0.1:8080/teamsString/${this.playerNames.join(",")}`;
  
        fetch(url)
          .then(response => response.json())
          .then(data => {
            this.isLoading = false;
            this.data = data;
            console.log(data[0].length);
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

    },
  };
  </script>
  