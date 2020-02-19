import Vue from "vue";
import Vuex from "vuex";
import { db, auth } from "@/firebase.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    numberOfTickets: {},
    auditoriums: [],
    publishMovies: false,
    movies: [],
    screenings: [], 
    bookings: [], 
    movieFilter: '',         
    user: {
      loggedIn: false,
      data: null,
    },
    publishBooking: false,
    booking: Object
  },
  mutations: {
    movieShowing(state, value) {
      state.movieDisplay = value;
    },
    setMovies(state, data) {
      state.movies = data;
    },
    setBookings(state, data) {
      state.bookings = data;
    },
    setScreenings(state, data) {
      state.screenings = data;
    },
    publishMovies(state){
      state.publishMovies=true;
    },
    setMovieFilter(state, data){
      state.movieFilter = data;
    },
    setLoggedIn(state, value) {
      state.user.loggedIn = value;
    },
    setUser(state, data) {
      state.user.data = data;
    },
    setBooking(state, data) {
      state.booking = data;
      state.publishBooking = true;
    },
    setAuditoriums(state, data){
      state.auditoriums = data;
    },
    setNumberOfTickets(state, data){
      state.numberOfTickets = data;
    },
    updateBooking(state, data){
      state.booking.bookedSeats = data.bookedSeats;
      state.booking.auditoriumSeats = data.auditoriumSeats;
      state.booking.account = data.account;
    }
  },
  actions: {
    async getBookings({commit}, payload){

      let bookings = [];
      const col = db.collection("bookings")
      const query = col.where('account', '==', payload.account)
      query.get().then(snapshot => {
        snapshot.docs.forEach(doc => {
          let booking = doc.data()
          booking.time = booking.time.toDate()
          bookings.push(booking)
        })
      })

      commit('setBookings', bookings)
     },
    async getMovies({commit}){
      let querySnapshot = await db.collection("movies").get()
      let movies = [];
      querySnapshot.forEach((movie) => {
        let data = movie.data();
        data.id = movie.id;
        movies.push(data);
      })
      commit('setMovies', movies)
     },
     async getScreenings({commit, dispatch}){
      let querySnapshot = await db.collection("screenings").get();
      let screenings = [];
      querySnapshot.forEach(screening => {
        let data = screening.data();
        data.id = screening.id;
        data.time = data.time.toDate();
        this.state.movies.forEach( movie =>{
          if(movie.id == data.movieId){
            screening.film = movie;
          }
        })
        this.state.auditoriums.forEach( auditorium => {
          if(auditorium.id == data.auditoriumId){
            data.auditorium = auditorium;
          }
        })
        if(data.seats.length === 0){
          for(let row = 0; row < data.auditorium.seatsPerRow.length; row++) {
            data.seats[row] = {}
            for(let col = 0; col < data.auditorium.seatsPerRow[row]; col++) {
              let seat = {
                  x: col,
                  y: row, 
                  isAvailable: true
                }
              data.seats[row][col]=seat; 
            }
          }
          dispatch("updateScreeningSeats", data)
        }
        screenings.push(data);
      });
      commit("setScreenings", screenings);
    },
    async getAuditoriums({ commit }) {
      let querySnapshot = await db.collection("auditoriums").get();
      let auditoriums = [];
      querySnapshot.forEach(auditorium => {
        let data = auditorium.data();
        data.id = auditorium.id;
        auditoriums.push(data);
      });
      commit("setAuditoriums", auditoriums);
    },
    async publishMovies({ commit }) {
      let documents = require("@/data/movies.json");
      for (let document of documents) {
        let res = await db.collection("movies").add(document);
        console.log("publishmovies res" + res);
      }
      commit("publishMovies");
    },
    async updateScreeningSeats({commit}, payload){
      db.collection("screenings").doc(payload.id).update({seats: payload.seats})
    },
    async publishBooking({ commit }, payload) {
      //Screening update
        db.collection("screenings")
        .doc(payload.screeningID)
        .update({
          seats: payload.auditoriumSeats,
          seatsAvailable: payload.seatsLeft
        })
      
      //Booking added to Bookings
      let booking = {
        childTickets: payload.childTickets,
        customerBookingReferenceNumber: payload.customerBookingReferenceNumber,
        regularTickets: payload.regularTickets,
        screeningDate: payload.screeningDate,
        screeningID: payload.screeningID,
        screeningTime: payload.screeningTime,
        screeningTitle: payload.screeningTitle,
        seniorCitizenTickets: payload.seniorCitizenTickets,
        totalPriceForPurchase: payload.totalPriceForPurchase,
        account: payload.account,
        seats: payload.bookedSeats,
        time: payload.screeningTimeStamp,
      };
      await db.collection("bookings").add(booking);
    },
    async createUser(user){
     await db.collection('accounts').add(user);
  },
    async registerUser({ commit },form){
     let data = await auth.createUserWithEmailAndPassword(form.email, form.password)
     let result = await data.user.updateProfile({displayName: form.name})
     if(result){
     this.dispatch('fetchUser', data.user)
    }
  },
    async loginUser({ commit }, form){
     try{
     let result = await auth.signInWithEmailAndPassword(form.email, form.password)
     if(result){
      this.dispatch('fetchUser', result.user)
    }
  }
    catch{
      console.log("fel användarnamn")
    }
  },
   fetchUser({ commit }, user) {
    commit("setLoggedIn", user !== null);

    if (user) {
      commit("setUser", {
        displayName: user.displayName,
        email: user.email,
      });
    } else {   
      commit("setUser", null);
    }
  }
  },
  modules: {}
});
