import Vue from "vue";
import VueRouter from "vue-router";
import MovieList from "../views/movieList.vue";
import Movie from "../views/movieShowing.vue";
import aboutPage from "@/views/aboutPage.vue";
import homePage from "@/views/Home.vue";
import ticketBooking from "@/views/ticketBooking.vue";
import logIn from "@/views/logIn.vue";
import createUser from "@/views/createUser.vue"
import myAccount from "@/views/myAccount.vue"


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "homePage",
    component: homePage
  },
  {
    path: "/login",
    name: "logIn",
    component: logIn
  },
  {
    path: "/about",
    name: "aboutPage",
    component: aboutPage
  },
  {
    path: "/movies",
    name: "movielist",
    component: MovieList
  },
  {
    path: "/tickets/:screening",
    name: "ticketBooking",
    component: ticketBooking
  },
  {
    path: "/movies/:movie",
    name: "movie",
    component: Movie
  },
  {
    path: "/create_user",
    name: "createUser",
    component: createUser
  },
  {
    path: "/account",
    name: "account",
    component: myAccount
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    document.getElementById("app").scrollIntoView();
  }
});

export default router;
