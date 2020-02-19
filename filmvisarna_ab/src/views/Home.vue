<template>
<div class="col">
    <div class="col container valign-wrapper">

     <h5 class="">Aktuella filmer</h5>

      <div class="col valign-wrapper carousel-contain">
       <div class="carousel carousel-slider center top-carousel" >
        <router-link :to="'/movies/' + movie.movieId" class="carousel-item top-carousel-item" v-for="(movie, i) in movies" :key="movie +i">
         <img class="img-carousel-top responsive-img" :src="movie.images[1]" alt="">
         <div class="carousel-fixed-item">
          <h5 class="flow-text">{{movie.title}}</h5>
         </div>
        </router-link>  
       </div>
      </div>
    </div>

    <div class="container col">
        <div class="row">
            <FilteringButton class="col s12 m4 l2 no-padding" :type="'datum'"></FilteringButton>
        </div>
        <MovieList></MovieList>
    </div>
</div>
</template>

<script>
import MovieList from "@/components/movieList.vue";
import FilteringButton from "@/components/FilteringButton.vue";

export default {
    components: {
        MovieList,
        FilteringButton
    },

    computed: {
        movies() {
            let movies = this.$store.state.movies;
            return movies;
        },
        /* moviesShowingToday filters movies and compares screening time with today's date and returns the array to render in carousel */
        moviesShowingToday() {
            let allScreenings = this.$store.state.screenings;
            let allMovies = this.$store.state.movies;
            let moviesShowingToday = [];
            let today = new Date();
            allMovies.forEach(movie => {
                allScreenings.forEach(screening => {
                    if (
                        today.getDate() === screening.time.getDate() &&
                        today.getMonth() === screening.time.getMonth() &&
                        today.getFullYear() === screening.time.getFullYear() &&
                        screening.movieId == movie.id
                    ) {
                        moviesShowingToday.push(movie);
                    }
                });
            });
            return moviesShowingToday;
        }
    },
    methods: {
      initializeCarousels(){
      if(!this.runOnce){
        let elems = document.querySelectorAll(".top-carousel");
        this.$M.Carousel.init(elems, {fullWidth: true, indicators: true});
      }
    },
    toMovieShowing(movie) {
      try {
        console.log(movie);
        this.$router.push({ path: "/movies/" + movie.movieId });
      } catch {
        console.log();
      }
    }
  },
  created() {
    this.$store.dispatch("getMovies");
  },
  mounted() {
   this.initializeCarousels();
  },  
  updated(){
    this.initializeCarousels();
  }

};
</script>

<style scoped>
.carousel-contain{
    margin-bottom: 5%;
}
.carousel-fixed-item{  
    text-align: left !important;
    margin: -1% 5%;
  }
.carousel-item {
  width: 100% !important;
  height: 53% !important;
}
h5{
text-shadow: 1px 1px 0 #000,
    -1px 1px 0 #000,
    1px -1px 0 #000,
    -1px -1px 0 #000,
    0px 1px 0 #000,
    0px -1px 0 #000,
    -1px 0px 0 #000,
    1px 0px 0 #000,
    2px 2px 0 #000,
    -2px 2px 0 #000,
    2px -2px 0 #000,
    -2px -2px 0 #000,
    0px 2px 0 #000,
    0px -2px 0 #000,
    -2px 0px 0 #000,
    2px 0px 0 #000,
    1px 2px 0 #000,
    -1px 2px 0 #000,
    1px -2px 0 #000,
    -1px -2px 0 #000,
    2px 1px 0 #000,
    -2px 1px 0 #000,
    2px -1px 0 #000,
    -2px -1px 0 #000;
}

.carousel {
  width: 100vw !important;
  height: 40vh !important;
  margin: 0 !important;
}
.img-carousel-top{
  height: 55%!important;
  width: 100%!important; 
}
a {
    height: 80% !important;
}
.carousel-fixed-item{
    position: relative !important;
}
.no-padding {
    padding: 0;
}

@media only screen and (min-width: 768px) {
  .carousel-item {
    width: 100% !important;
    height: 100% !important;
  }
  .carousel {
    width: 80vw !important;
    height: 50vh !important;
  }
  .img-carousel-top{
  height: 70%!important;
  width: 100%!important; 
}
}
@media only screen and (min-width: 1025px) {
  .carousel-item {
    width: 100% !important;
  height: 100% !important;
  }
  .carousel {
    width: 50.5vw !important;
    height: 55.5vh !important;
  }
  .img-carousel-top{
  height: 100%!important;
  width: 100%!important;
  }
  .carousel-fixed-item{  
    text-align: left !important;
    margin: -1% 5%;
  }
  
}
</style>
