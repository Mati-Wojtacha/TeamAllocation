<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <ul class="nav nav-pills card-header-pills">
                <li class="nav-item">
                  <button
                    class="nav-link btn btn-link"
                    :class="{ active: activeTab === 'login' }"
                    @click="activeTab = 'login'"
                  >
                    Logowanie
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    class="nav-link btn btn-link"
                    :class="{ active: activeTab === 'register' }"
                    @click="activeTab = 'register'"
                  >
                    Rejestracja
                  </button>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div v-if="activeTab === 'login'">
                <h5 class="card-title">Formularz logowania</h5>
                <form>
                  <div class="form-group">
                    <label for="loginEmail">Email</label>
                    <input type="email" class="form-control" id="loginEmail" v-model="loginEmail">
                  </div>
                  <div class="form-group">
                    <label for="loginPassword">Hasło</label>
                    <input type="password" class="form-control" id="loginPassword" v-model="loginPassword">
                  </div>
                  <button type="submit" class="btn btn-primary" @click.prevent="login">Zaloguj</button>
                </form>
              </div>
              <div v-if="activeTab === 'register'">
                <h5 class="card-title">Formularz rejestracji</h5>
                <form>
                  <div class="form-group">
                    <label for="registerName">Imię</label>
                    <input type="text" class="form-control" id="registerName" v-model="registerName">
                  </div>
                  <div class="form-group">
                    <label for="registerEmail">Email</label>
                    <input type="email" class="form-control" id="registerEmail" v-model="registerEmail">
                  </div>
                  <div class="form-group">
                    <label for="registerPassword">Hasło</label>
                    <input type="password" class="form-control" id="registerPassword" v-model="registerPassword">
                  </div>
                  <button type="submit" class="btn btn-primary" @click.prevent="register">Zarejestruj</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState } from 'vuex';
  
  export default {
    computed: {
        ...mapState(['user']),
    },
    data() {
      return {
        activeTab: 'login',
        loginEmail: '',
        loginPassword: '',
        registerName: '',
        registerEmail: '',
        registerPassword: '',
      };
    },
  
    methods: {
      validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      },
      async login() {
        if (!this.validateEmail(this.loginEmail)) {
          alert('Błędny format adresu e-mail.');
          return;
        }
  
        try {
          const response = await axios.post('http://localhost:8080/api/users/login', {
            email: this.loginEmail,
            password: this.loginPassword,
          });
            const token = response.data;
            window.localStorage.setItem('token', token);          
            console.log(window.localStorage.getItem('token'));
            try{
                const headers = { Authorization: `${token}` };
                const responseUser = await axios.get('http://localhost:8080/api/users/infoFromToken', { headers });
                console.log(responseUser.data.id);
                console.log(responseUser.data.username);

                this.$store.commit('setUser', {
                    id: responseUser.data.id,
                    name: responseUser.data.username
                });
                this.$router.push('/');
                } catch (error) {
                console.error(error);
                }
        } catch (error) {
          alert('Błąd logowania');
          console.error(error);
        }
      },
      async register() {
        if (!this.validateEmail(this.registerEmail)) {
          alert('Błędny format adresu e-mail.');
          return;
        }
        try {
          const response = await axios.post('http://localhost:8080/api/users/register', {
            name: this.registerName,
            email: this.registerEmail,
            password: this.registerPassword,
          });
          alert(response.data);
        } catch (error) {
          alert('Błąd rejestracji');
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style>
  .container {
    margin-top: 20px;
  }
  </style>
  