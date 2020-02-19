<template>
<div id="app">
    <mainHeader />
    <main>
        <router-view />
    </main>
    <Footer />
</div>
</template>

<script>
import mainHeader from '@/components/header.vue'
import Footer from '@/components/footer.vue'

export default {
  components:{
    Footer,
    mainHeader
  },
  created(){
    this.$store.dispatch("getAuditoriums");
    this.$store.dispatch("getMovies");
    this.$store.dispatch("getScreenings");
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Squada+One&display=swap");
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: white !important;
    font-family: Arial, Helvetica, sans-serif;

}

.container {
    display: flex;
}

.col {
    flex-direction: column;
}

#app {
    width: 100vw;
    min-height: 100vh;
    background-color: rgb(0, 0, 0);
    flex-direction: column;
    display: flex;

}

body {
    overflow-x: hidden;
}

main {
    flex: 1;
    margin: 2% 0;

}
</style>
