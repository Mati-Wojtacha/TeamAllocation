n<template>
  <header>
    
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <div class="text-center mx-auto">
          <ul class="navbar-nav">
      <li class="nav-item">
        <RouterLink to="/" class="nav-link">Main</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/teams" class="nav-link">Teams</RouterLink>
      </li>
      <li class="nav-item" v-if="user != null">
        <RouterLink to="/new-matches" class="nav-link">Zapisane mecze</RouterLink>
      </li>
      <li class="nav-item" v-if="user == null">
        <RouterLink to="/login" class="nav-link">Logowanie!</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink to="/about" class="nav-link">About</RouterLink>
      </li>
    </ul>
  </div>
  </div>
</nav>

  </header>

  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import { mapState } from 'vuex';
import axios from 'axios';


export default {
  data() {
    return {
      dateFromToken: null,
    }
  },
  computed: {
    ...mapState(['user']),
  },
  beforeMount() {
    this.checkTokenValidity();
  },
  mounted() {
       setInterval(this.checkTokenTime, 6000);
  },
  methods: {
    checkTokenValidity() {
      const currentDate = new Date();
      const token = window.localStorage.getItem('token');
      if (this.dateFromToken < currentDate && token!=null) {
        axios.get('http://localhost:8080/api/users/verify', {
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          console.log('Odpowiedź z API:', response.data);
        })
        .catch(error => {
          this.dateFromToken=null;
          localStorage.removeItem('token');
          this.$store.commit('user', null);
          alert('Wymagane ponowne zalogowanie.');
        });
      } else {
          this.dateFromToken=null; 
          localStorage.removeItem('token');
          this.$store.commit('user', null);
          alert('Wymagane ponowne zalogowanie.');
        }
    },
    checkTokenValidity() {
      const token = window.localStorage.getItem('token');
      this.$store.commit('user/setUser', null);

      if (token) {
        axios.get('http://localhost:8080/api/users/infoFromToken', {
          headers: {
            Authorization: `${token}`
          }
        })
        .then(response => {
          console.log(response);
          this.dateFromToken = response.data.data;
          if (!this.user) {
            this.$store.commit('setUser', {
              id: response.data.id,
              name: response.data.username
            });
          }
        })
        .catch(error => {
          this.dateFromToken=null;
          localStorage.removeItem('token');
          this.$store.commit('user', null);
          alert('Wymagane ponowne zalogowanie.');
        });
      }
    }
  }
}
</script>