<template>
<div>
    <div class="container col">
        <iframe class="trailer responsive-video" :src="'https://www.youtube.com/embed/' + movie.trailer" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        <div class="col s12">
            <h3 class="header">{{movie.title}}</h3>
            <div class="card horizontal black">
                <div class="card-image">
                    <img :src="movie.images[0]" alt="MoviePoster" class="responsive-img" id="moviePoster">
                </div>
                <div class="card-stacked">
                    <div class="card-content valign-wrapper">
                        <div class="hide-on-med-and-down">
                            <p class="large-text">{{movie.genre}}</p>
                            <p class="large-text">{{movie.length}} min</p>
                            <p class="large-text">{{movie.language}}</p>
                            <p class="small-margin large-text">{{ movie.description }}</p>
                        </div>
                        <div class="hide-on-large-only">
                            <p class="genretext">{{movie.genre}}</p>
                            <p class="lengthtext">{{movie.length}} min</p>
                            <p class="languagetext">{{movie.language}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="divider"></div>
        <div class="row">
            <div class="col s12">
                <div class="card-panel black moviedisc hide-on-large-only">
                    <span class="white-text">{{movie.description}}</span>
                </div>
                <div class="card-panel black smallmovieinfo">
                    <div class="subheader">Regissör:</div>
                    <div class="">{{movie.director}}</div>

                    <div class="subheader">Skådespelare:</div>
                    <div>{{ this.getActors(movie)}}</div>

                    <div class="subheader">Produktionsländer:</div>
                    <div>{{ this.getProductionCountries(movie) }}</div>

                    <div class="subheader">Undertext:</div>
                    <div>{{movie.subtitles}}</div>

                    <div class="subheader">Produktionsår:</div>
                    <div>{{movie.productionYear}}</div>

                </div>
            </div>
        </div>
      <screenings :movieTitle="movie.title" />
    </div>
</div>
</template>

<script>
import screenings from "@/components/screenings.vue"

export default {
    components: {
        screenings,
    },
    computed: {
        movie() {
            let movies = this.$store.state.movies;
            for (let movie of movies) {
                if (movie.movieId === this.$route.params.movie) {
                    return movie;
                }
            }
            return null;
        }
    },
    methods: {
        getProductionCountries(movie) {
            let productionCountries = '';
            for (let i = 0; i < movie.productionCountries.length; i++) {
                if (i === movie.productionCountries.length - 1) {
                    productionCountries += movie.productionCountries[i];
                } else {
                    productionCountries += `${movie.productionCountries[i]}, `
                }
            }
            return productionCountries;
        },
        getActors(movie) {
            let actors = '';
            for (let i = 0; i < movie.actors.length; i++) {
                if (i === movie.actors.length - 1) {
                    actors += movie.actors[i]
                } else {
                    actors += `${movie.actors[i]}, `
                }
            }
            return actors;
        }
    },
}
</script>

<style scoped>
.trailer {
    width: 100%;
    height: 40vh;
}

.img {
    max-width: 15vw;
    height: auto;
}

.genretext {
    font-size: 1.2em;
}

.lengthtext {
    font-size: 0.8em;
}

.languagetext {
    font-size: 0.8em;
}

.subheader {
    font-size: 0.9em;
    margin-top: 0.5%;
}

.large-text {
    font-size: 1.2rem;
}

.medium-text {
    font-size: 1rem
}

.small-text {
    font-size: 0.8rem;
}

.small-margin {
    margin: 2% 0 !important;
}

#moviePoster {
    width: 35vw;
}

.smallmovieinfo {
    padding-top: 0%
}

.moviedisc {
    padding-bottom: 2%;
}

.card-content {
    padding: 0 0 0 24px;
    align-items: flex-end;
}

@media screen and (min-width: 515px) {
    #moviePoster {
        width: 15vw;
    }

    .moviedisc {
        width: 50vw;
    }
}
</style>
