<template>
    <div>
      <div v-if="data.length > 0" v-for="(item, index) in data[0]" :key="index">
        <p>Mecz {{ index + 1 }}:<br>
            {{ item }} vs {{ data[1][index] }}<br>
            Wynik Meczu:&nbsp;
            <span v-if="results[index]" class="input-container">
              <input v-if="results[index]" class="form-control" type="number" :id="'result1_' + index" v-model="results[index].result1" @input="onInputChange($event)">
              &nbsp;do&nbsp;
              <input v-if="results[index]"  class="form-control" type="number" :id="'result2_' + index" v-model="results[index].result2" @input="onInputChange($event)">
            </span>
          </p>

      </div>
    </div>
</template>

<script>
import { blockNegativeNumbersAndText } from './BlockNumbersAndText';
export default {
  props: ["data", "results"],
  methods: {
    blockNegativeNumbersAndText,
    onInputChange(event) {
      this.blockNegativeNumbersAndText(event);
    }
  },
};
</script>
