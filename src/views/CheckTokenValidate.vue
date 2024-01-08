<script>
import { RouterLink, RouterView } from 'vue-router';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['user'])
  },
  beforeMount() {
    this.checkTokenValidity();
  },
  methods: {
    checkTokenValidity() {
      const token = window.localStorage.getItem('token');
      this.$store.commit('user/setUser', null);

      if (token) {
        axios.get('http://localhost:8080/api/users/verifyToken', {
          headers: {
            Authorization: `${token}`
          }
        })
          .then(async response => {
            console.log(response);
            if (!this.user) {
              try {
                const headers = {Authorization: `${token}`};
                const responseUser = await axios.get('http://localhost:8080/api/users/infoFromToken', {headers});
                console.log(responseUser.data.id);
                console.log(responseUser.data.username);

                this.$store.commit('setUser', {
                  id: responseUser.data.id,
                  name: responseUser.data.username
                });
              } catch (error) {
                console.error(error);
              }
            }
          })
          .catch(error => {
            localStorage.removeItem('token');
            this.$store.commit('user', null);
            alert('Wymagane ponowne zalogowanie.');
          });
      }
    }
  }
};
</script>
