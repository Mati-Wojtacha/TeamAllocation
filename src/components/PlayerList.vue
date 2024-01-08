<template>
  <div>
    <h2>Lista graczy:</h2>
    <button class="btn btn-secondary" @click="toggleList">Pokaż/ukryj listę</button>
    <ul v-if="showList">
      <p v-for="(player, index) in playerNames" :key="index">
        {{ player }}      
        <button type="button" class="btn btn-secondary" @click="$emit('edit-player', index)">Edytuj</button>
        <button type="button" class="btn btn-danger" @click="$emit('delete-player', index)">Usuń</button>
      </p>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["playerNames"],
  data() {
    return {
      showList: true
    };
  },
  methods: {
    toggleList() {
      this.showList = !this.showList;
    },
  }
};
</script>
