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
                  <input type="number" v-model="match.result.team1" class="form-control d-inline w-auto" @change="handleInputChange(index)" /> do
                  <input type="number" v-model="match.result.team2" class="form-control d-inline w-auto" @change="handleInputChange(index)" />
                </div>
            </td>
            <td>
              <!-- <p>{{ item.parsedMatches.summary }}</p> -->
              <p>{{ getSummary(item.parsedMatches) }}</p>
              <div class="d-flex justify-content-center">
                <button type="button" 
                    :class="!changedInput[index] ? 'btn btn-success disabled' : 'btn btn-success'"
                    @click="updateMatch(item.id)">
                    Update
                </button>
                <button type="button" class="btn btn-danger" @click="deleteMatch(item.id)">Usuń mecz</button>
              </div>             

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
        matches: [],
        changedInput: {}
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
      },
      getSummary(item) {
        const uniquePlayers = this.getUniquePlayers(item);
        const result = {};

        for (const uniquePlayer of uniquePlayers) {
            result[uniquePlayer] = 0;
            for (const match of item.matches) {
                let teamWon = '';
                if (match.result.team1 > match.result.team2) {
                    teamWon = 'team1';
                } else if (match.result.team1 < match.result.team2) {
                    teamWon = 'team2';
                } else {
                    continue;
                }

                if (!match[teamWon].includes(uniquePlayer)) {
                    continue;
                }

                result[uniquePlayer] += 1;
            }
        }

        let message = 'Statystyki punktowe graczy: ';
        for (const res in result) {
            message += ` ${res}: ${result[res]} pkt,`
        }
        return message.substring(0, message.length-1);
      },
      getUniquePlayers(item) {
        const uniquePlayers = [];
        const teams = item.matches.map(i => ([...i.team1, ...i.team2]));
        for (const players of teams) {
            for (const player of players) {
                if (uniquePlayers.includes(player)) {
                    continue;
                }
                uniquePlayers.push(player);
            }
        }
        return uniquePlayers;
      },
      handleInputChange(index) {
        this.changedInput[index] = true;
      },
      async deleteMatch(id) {
        if (window.confirm("Czy jesteś pewny, że chcesz usunąć mecz z historii?")) {
            try {
            const token = window.localStorage.getItem('token'); // get the token from local storage or from where you have stored it.
            const response = await axios.delete(`http://localhost:8080/api/matches/${id}`, {
                headers: {
                'Authorization': token
                }
            });
            if (response.status === 200) {
                console.log('Match deleted successfully');
            } else {
                console.log('An error occurred: ', response.status);
            }
            } catch (error) {
            console.error(error);
            }
        }
        },
      async updateMatch(id) {
        console.log('matches', this.matches)
        let objectToSend = this.matches.filter(m => m.id == id);
        if (!objectToSend || objectToSend.length > 1 || !objectToSend[0]) {
            return;
        }

        objectToSend = objectToSend[0];
        objectToSend.parsedMatches.summary = this.getSummary(objectToSend.parsedMatches);
        
        objectToSend = {
            id,
            matchObject: JSON.stringify({ matches: objectToSend.parsedMatches.matches }),
            user_id: objectToSend.user.id,
        }
        console.log('objectToSend', objectToSend);        
        try {
        const token = window.localStorage.getItem('token'); // get the token from local storage or from where you have stored it.
        const response = await axios.put(`http://localhost:8080/api/matches/${id}`, 
          objectToSend, 
          {
            headers: {
              'Authorization': token
            }
          } 
        );
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
  