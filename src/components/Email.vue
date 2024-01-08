<template>
    <div>
      <h2>Wyślij zestawienie meczy na adres email!</h2>
      <form @submit.prevent="sendEmail">
        <!-- @submit.prevent="$emit('sendEmail')"> -->
        <div v-for="(player, index) in playerNames" :key="index">
          <label :for="'email_' + index">Adres e-mail gracza {{ index + 1 }}:</label>
          <input type="email" :id="'email_' + index" v-model="emailData[index].email">
        </div>
        <button class="btn btn-primary" type="submit" :disabled="sendEmailButton">Wyślij zestawienie</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    props: ["playerNames", "emailData", "data", "results"],
    data() {
      return {
        sendEmailButton: false,  
      }
    },
    methods: {
      sendEmail() {
        console.log("sendEmail");
        const emailList = this.emailData.map(item => item.email);
        console.log("Lista adresów e-mail:", emailList);
        let messageToSend = "";
        console.log(this.data);
        console.log(this.results);
        for (let i = 0; i < this.data[0].length; i++) {
          const team1 = this.data[0][i];
          const team2 = this.data[1][i];
          const result1 = this.results[i].result1;
          const result2 = this.results[i].result2;
          messageToSend += `Mecz ${i + 1}: ${team1} VS ${team2} zakończył się wynikiem: ${result1} do ${result2} \n`;
        }

        const summaryElement = document.getElementById("summary");
        const messageFromPage = summaryElement.textContent.trim();
        console.log(summaryElement);
        messageToSend += messageFromPage;
        console.log(messageToSend);
   
        try{
          const response = axios.post('http://localhost:8080/sendEmail', {
          emailList: emailList,
          message: messageToSend
        });
          console.log(response.data);
          this.sendEmailButton = true;
          alert('Pomyślnie wysłano dane do wysłania');
        } catch (error) {
          console.error(error);
        }

        this.$emit('send-email');
      }
    },
  };
  </script>
  