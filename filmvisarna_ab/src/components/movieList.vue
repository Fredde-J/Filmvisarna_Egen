<template>
  <ul class="row">
    <li
      v-for="(movie, i) in movies"
      v-bind:key="movie.title + i"
      class="col s12 m6 xl4"
      @click="toMovieShowing(movie)"
    >
      <div class="card horizontal black">
        <img :src="movie.images[0]" :alt="movie.title + ' poster'" />
        <div
          class="card-stacked"
          :style="{
            backgroundImage: 'url(' + movie.images[1] + ')',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }"
        >
          <div class="card-content valign-wrapper">
            <div>
              <h5 class="movie-info">{{ movie.title }}</h5>
              <h6 class="movie-info">{{ movie.genre }}</h6>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  computed: {
    filter() {
      return this.$store.state.movieFilter;
    },
    movies() {
      let filter = this.filter;
      let isDate = filter instanceof Date;
      let movies;
      if (!isDate) {
        movies = this.getMoviesByGenre(filter);
        return movies;
      } else {
        movies = this.getMoviesByDate(filter);
        return movies;
      }
    }
  },
  methods: {
    toMovieShowing(movie) {
      this.$store.commit("movieShowing", movie);
      this.$router.push({
        path: "/movies/" + movie.movieId
      });
    },

    getMoviesByGenre(filter) {
      let movies = this.$store.state.movies;
      if (filter === "") {
        return movies;
      } else {
        let results = movies.filter(function(movie) {
          return movie.genre.includes(filter);
        });
        return results;
      }
    },
    getMoviesByDate(filter) {
      let moviesFromStore = this.$store.state.movies;
      let screenings = this.$store.state.screenings;
      let movies = [];
      screenings.forEach(screening => {
        if (
          filter.getDay() === screening.time.getDay() &&
          filter.getMonth() === screening.time.getMonth() &&
          filter.getFullYear() === screening.time.getFullYear()
        ) {
          moviesFromStore.forEach(movie => {
            if (screening.film === movie.title) {
              movies.push(movie);
            }
          });
        }
      });
      movies = Array.from(new Set(movies));
      return movies;
    }
  },
  destroyed() {
    this.$store.commit("setMovieFilter", "");
  }
};
</script>

<style scoped>
li {
  padding: 0 !important;
  margin: 1% 0;
  cursor: pointer;
}

.card {
  height: 15vh;
  margin: 0 1%;
  border-radius: 4px;
}

.card:hover {
  box-shadow: 0 0 5px gray;
  background-image: white;
  z-index: 1;
}

img {
  height: 100%;
  width: auto;
  border-radius: 4px 0 0 4px;
}
.card-stacked {
  border-radius: 0 4px 4px 0;
}
.card-content {
  height: 100%;
  padding: 0;
  padding-left: 2%;
  padding-bottom: 2%;
  background-image: linear-gradient(
    bottom,
    rgba(0, 0, 0, 0.9),
    rgb(0, 0, 0, 0.2)
  );
  align-items: flex-end;
  border-radius: 0 4px 4px 0;
}

.movie-info {
  width: 100%;
  margin: 1%;
  text-align: left;
}

@media screen and (min-width: 1200px) {
  .card {
    height: 20vh;
  }
}
</style>
