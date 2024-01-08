<template>
    <form @submit.prevent="addPlayer">
      <label  for="playerName">Nazwa gracza:</label>
        <div class="d-flex align-items-center">
          <input class="form-control" type="text" id="playerName" v-model="newPlayerName">
          <button class="btn btn-primary ml-2" type="button" @click="addPlayer">Dodaj gracza</button>
        </div>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newPlayerName: "",
      };
    },
    methods: {
      addPlayer() {
        this.$emit('add-player', this.newPlayerName);
        this.newPlayerName = "";
      }
    }
  };
  </script>
  