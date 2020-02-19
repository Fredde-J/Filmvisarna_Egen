<template>
<div>
    <div class="container col">
        <div class="row">
            <filtering class="col s6 m4 l2 no-padding" :type="'genre'"></filtering>
        </div>
        <MovieList></MovieList>
    </div>
</div>
</template>

<script>
import MovieList from '@/components/movieList.vue'
import filtering from '@/components/FilteringButton.vue'

export default {
    components: {
        MovieList,
        filtering
    },
}
</script>

<style scoped>
.no-padding {
    padding: 0;
}
</style>
