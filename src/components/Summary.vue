<template>
    <div id="summary">
      <h2>Zestawienie punktowe: </h2>
      <ul>
        <li id="summary-player" v-for="(player, index) in playerNames" :key="index">
          {{ player }}: {{ getPoints(data, results, player,) }} pkt
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { getPoints } from '../calc-points.ts';

  export default {
    props: ["playerNames", "data", "results"],
    methods: {
      getPoints,
    },
    created: () => {
      console.log("test created");
    },
    mounted: () => {
      console.log("test mounted");
    }
  };
  </script>
  