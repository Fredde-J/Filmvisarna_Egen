<template>
<div>
    <a href="#" class="dropdown-trigger btn light-blue darken-4" :data-target="'drop-down-menu-' + type"> {{ buttonText }}</a>
    <ul :id="'drop-down-menu-' + type" class="dropdown-content">
        <li class="light-blue darken-2" @click.stop="filterMovies({filter: ''})"><span class="center-align all">Alla</span></li>
        <li class="light-blue darken-2" @click.stop="filterMovies(content)" v-for="(content, i) of dropdownContents" :key="content+i"><span class="center-align contents">{{ content.menuOutput }}</span></li>
    </ul>
</div>
</template>

<script>
export default {
    props: {
        type: String,
    },
    mounted() {
        let elements = document.querySelectorAll('.dropdown-trigger');
        this.$M.Dropdown.init(elements);
    },
    computed: {
        dropdownContents() {
            let contents = [];
            switch (this.type) {
                case "genre": {
                    let movies = this.$store.state.movies;
                    let genres = [];
                    movies.forEach(movie => {
                        genres.push(movie.genre);
                    })
                    genres = Array.from(new Set(genres));
                    genres.forEach(genre => {
                        contents.push({
                            menuOutput: genre,
                            filter: genre
                        })
                    })
                    break;
                }
                case "datum": {
                    let screenings = this.$store.state.screenings;
                    let dates = [];
                    let timeNow = new Date();
                    let tomorrow = new Date(timeNow.getTime() + (1000 * 60 * 60 * 24))

                    screenings.sort((a, b) => {
                        return a.time.getTime() - b.time.getTime();
                    })
                    screenings.forEach(screening => {
                        if (screening.time > timeNow) {
                            dates.push(this.dateAsString(screening.time))
                        }
                    })
                    dates = Array.from(new Set(dates));
                    dates.forEach(date => {
                        screenings.every(screening => {
                            if (date === this.dateAsString(screening.time)) {
                                if (
                                    timeNow.getDate() === screening.time.getDate() &&
                                    timeNow.getMonth() === screening.time.getMonth() &&
                                    timeNow.getFullYear() === screening.time.getFullYear()
                                ) {
                                    contents.push({
                                        menuOutput: 'Idag',
                                        filter: screening.time
                                    });
                                } else if (
                                    tomorrow.getDate() === screening.time.getDate() &&
                                    screening.time.getMonth() === tomorrow.getMonth() &&
                                    screening.time.getFullYear() === tomorrow.getFullYear()
                                ) {
                                    contents.push({
                                        menuOutput: 'Imorgon',
                                        filter: screening.time
                                    });
                                } else {
                                    contents.push({
                                        menuOutput: date,
                                        filter: screening.time
                                    })
                                }
                                return false;
                            }
                            return true;
                        })
                    })
                    break;
                }
            }
            return contents;
        }
    },
    methods: {
        filterMovies(content) {
            if (content.filter !== '') {
                this.buttonText = content.menuOutput;
            } else {
                switch (this.type) {
                    case "genre":
                        this.buttonText = 'Välj genre';
                        break;
                    case "datum":
                        this.buttonText = 'Välj datum';
                        break;
                }
            }
            this.$store.commit('setMovieFilter', content.filter)
        },
        dateAsString(date) {
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        }
    },
    data() {
        return {
            buttonText: `Välj ${this.type}`
        }
    }
}
</script>

<style scoped>
.col>.btn {
    width: 100%;
    padding: 0;
}

.all {
    border: 1px white solid;
}

.contents {
    border-left: 1px white solid;
    border-right: 1px white solid;
    border-bottom: 1px white solid;
}

.dropdown-content li>span {
    color: white;
}
</style>
