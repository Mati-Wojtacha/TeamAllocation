<template>
    <div>
      <!-- <button class="btn btn-primary" @click="getMatchesFromUser">Pobierz mecze użytkownika</button> -->
      <div v-for="(item, index) in matches" :key="item.id" class="my-4">
        <table>
          <thead>
            <tr>
              <th colspan="2" class="text-center">Zapisane zestawienie meczy numer {{ index + 1 }}</th>
            </tr>
          </thead>
            <tr>
              <td>
                <div v-for="match in item.parsedMatches.matches" :key="match.matchNumber">
                  <h5 class="mb-2">Mecz {{ match.match}}:</h5>
                  {{ match.team1.join(', ') }} vs {{ match.team2.join(', ') }} zakończył się wynikiem
                  {{match.result.team1}} do {{match.result.team2}}
              </div>
            </td>
            <td>
              <p>{{ item.parsedMatches.summary }}</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        matches: []
      }
    },
    methods: {
      async getMatchesFromUser() {
        try {
          const response = await axios.get('http://localhost:8080/api/matches/user', {
            headers: {
              'Authorization': `${window.localStorage.getItem('token')}`
            }
          });
          this.matches = response.data.map(item => ({
            ...item,
            parsedMatches: JSON.parse(item.matchObject)
          }));
        } catch (error) {
          console.error(error);
        }
      }
    },
    created() {
      this.getMatchesFromUser();
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  td, th {
    border: 1px solid black;
    padding: 10px;
  }
  
  th {
    text-align: center;
  }
  </style>
  