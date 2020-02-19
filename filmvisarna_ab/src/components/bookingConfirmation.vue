<template>
<div class="main row flow-text container-fluid">
    <div class="col s12 m6 l6 xl6">
      <div class="card-image" v-for="(movie, i) in movies" :key="movie + i">
        <img
          class="movie-poster responsive-img"
          :src="movie.images[0]"
          v-if="movie.title == booking.screeningTitle"
        />
      </div>
    </div>

    <div class="col s12 m6 l6 xl6 center-align">
      <h4 class="title">Tack för din bokning!</h4>
      <p>{{ booking.screeningTitle }} - {{ booking.screeningTime }}</p>
      <p>{{ booking.screeningDate }}</p>
      <br>
      <p>
        Bokningsnummer : {{ booking.customerBookingReferenceNumber }}
      </p>
      <p v-if="booking.regularTickets != 0">
        Standardbiljetter : {{ booking.regularTickets }}
      </p>
      <p v-if="booking.childTickets != 0">
        Barnbiljetter : {{ booking.childTickets }}
      </p>
      <p v-if="booking.seniorCitizenTickets != 0">
        Pensionärbiljetter : {{ booking.seniorCitizenTickets }}
      </p>
      <p>Email: {{ booking.account }}</p>
      <br>
      <p>Platser:</p>
      <ul>
        <p v-for="(seat, i) in booking.bookedSeats" :key="seat + i">
        Rad: {{ seat.y + 1 }} Plats: {{ seat.x + 1 }}
        </p>
      </ul>
      <br>
      <p>Pris: {{ booking.totalPriceForPurchase }}kr</p>
    </div>
</div>
</template>

<script>
export default {
  computed: {
    booking() {
      return this.$store.state.booking;
    },
    movies() {
      return this.$store.state.movies;
    }
  },
  data() {
    return {
      show: false
    };
  },
};
</script>
<style scoped>
.responsive-img{
    max-height: 75vh;
}
.title{
    margin-top: 0%
}
</style>
