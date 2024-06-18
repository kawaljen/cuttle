<template>
  <div>
    <v-card v-if="userStat">
      <v-card-title>{{ userStat.username }} {{ t('stats.results') }}</v-card-title>
      <v-card-text>
        <h3>{{ t('stats.wins') }}</h3>
        {{ userStat.won }} / {{ userStat.played }}
        <h3 v-if="userStat.firstPlace"> 
          {{ userStat.firstPlace }} 
          times FirstPlace
        </h3>
        <h3 v-if="userStat.secondPlace"> 
          {{ userStat.secondPlace }} 
          times SecondPlace
        </h3>
        <div v-if="userStat.thirdPlace">
          <h3>ThirdPlace</h3>
          {{ userStat.thirdPlace }}
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          data-cy="close-player-results"
          variant="outlined"
          color="primary"
          @click="showMenu = false"
        >
          {{ t('global.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { io } from '@/plugins/sails.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  playerUsername: {
      type: String,
      default: null,
    },
});

const userStat = ref(null);
fetchUserStat();

function fetchUserStat(){
  if( typeof  props.playerUsername === 'string' &&  props.playerUsername.length >0){
        io.socket.get(
          `/api/stats/user`, 
            {
              username: props.playerUsername,
              },
              (res)=>{
                {
                  userStat.value = res.userStat;
                }
        });
    }
}
</script>

<style scoped>

</style>
