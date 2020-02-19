<template>
  <div class="main">
    <header
      class="backgroundColour row  header light-blue darken-4 valign-wrapper"
      :class="{ 'hidden-header': !showheader }"
    >
      <div class="col s2 m4 l4 xl4 valign-wrapper center-align">
        <ul class="valign-wrapper">
          <li>
            <i
              class="material-icons hide-on-large-only center-align valign-wrapper"
              @click="openSlideMenu"
              >menu</i
            >
          </li>
          <li>
            <router-link class="col hide-on-med-and-down desktop-link" to="/"
              >Hem</router-link
            >
          </li>
          <li>
            <router-link
              class="col hide-on-med-and-down desktop-link"
              to="/movies"
              >Filmer</router-link
            >
          </li>
          <li>
            <router-link
              class="col hide-on-med-and-down desktop-link"
              to="/about"
              >Om oss</router-link
            >
          </li>
        </ul>
      </div>
      <div id="tablet-menu">
        <div class="tablet-menu-links container">
          <ul class="tablet-links-list container ">
            <li class="tablet-link">
              <a href="#" @click.prevent="closeSlideMenu">
                <router-link class="tablet-link" to="/">HEM</router-link>
              </a>
            </li>
            <li class="tablet-link">
              <a href="#" @click.prevent="closeSlideMenu">
                <router-link class="tablet-link" to="/movies"
                  >FILMER</router-link
                >
              </a>
            </li>
            <li class="tablet-link">
              <a href="#" @click.prevent="closeSlideMenu">
                <router-link class="tablet-link" to="/about"
                  >OM OSS</router-link
                >
              </a>
            </li>
            <li class="tablet-link" v-if="user.loggedIn">
              <a href="#" @click.prevent="closeSlideMenu">
                <router-link class="tablet-link" to="/account"
                  >MINA SIDOR</router-link
                >
              </a>
            </li>
            <li class="tablet-link" v-if="user.loggedIn">
              <a
                href="#"
                @click.prevent="
                  closeSlideMenu();
                  signOut();
                "
              >
                <router-link class="tablet-link" to="/">LOGGA UT</router-link>
              </a>
            </li>
            <li class="tablet-link" v-if="!user.loggedIn">
              <a href="#" @click.prevent="closeSlideMenu()">
                <router-link class="tablet-link" to="/login"
                  >LOGGA IN</router-link
                >
              </a>
            </li>

            <a href="#" class="material-icons" @click.prevent="closeSlideMenu">
              <i class="material-icons btn-close">close</i></a
            >
          </ul>
        </div>
      </div>
      <div class="col s8 m4 l4 xl4 valign-wrapper center">
        <router-link to="/">
          <img
            src="@/images/logo_2.png"
            class="responsive-img"
            v-show="!user.loggedIn"
          />
          <img
            src="@/images/logo_1.png"
            class="responsive-img"
            v-show="user.loggedIn"
          />
        </router-link>
      </div>

      <div class="col s2 m4 l4 valign-wrapper right">
        <div v-if="user.loggedIn" class="userName center-align valign-wrapper">
          <router-link class="account" to="/account">
            <span class="hide-on-med-and-down">Mina sidor</span>
          </router-link>
        </div>
        <div class="loginIcon">
          <router-link to="/login" v-if="!user.loggedIn">
            <a class="material-icons user">account_circle</a>
          </router-link>
          <router-link to="/account" v-if="user.loggedIn">
            <a class="material-icons user">account_circle</a>
          </router-link>
        </div>
        <router-link class="account" to="/" v-if="user.loggedIn">
          <p class="sign-out hide-on-med-and-down" @click="signOut">Logga ut</p>
        </router-link>
      </div>
    </header>
  </div>
</template>

<script>
import auth from "@/firebase.js";
import firebase from "firebase";
export default {
  data() {
    return {
      showheader: true,
      lastScrollPosition: 0,
      scrollValue: 0
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    this.lastScrollPosition = window.pageYOffset;
    window.addEventListener("scroll", this.onScroll);
  },
  methods: {
    openSlideMenu() {
      document.getElementById("tablet-menu").style.height = "107.5vh";
    },
    closeSlideMenu() {
      document.getElementById("tablet-menu").style.height = "0";
    },
    onScroll() {
      if (window.pageYOffset < 5) {
        return;
      }
      if (Math.abs(window.pageYOffset - this.lastScrollPosition) < 5) {
        return;
      }
      this.showheader = window.pageYOffset < this.lastScrollPosition;
      this.lastScrollPosition = window.pageYOffset;
    },
    async signOut() {
      let result = await firebase.auth().signOut();
      let isLoggedIn = this.$store.state.user.loggedIn;
    }
  },
  watch: {
    $route: {
      deep: true,
      handler: function() {
        this.showheader = true;
        return this.onScroll();
      }
    }
  }
};
</script>

<style scoped>
.container {
  flex-direction: column;
}

.main {
  height: 9.5vh;
}

img {
  margin-top: 3%;
  height: 11vh !important;
}

.header {
  width: 100vw;
  background: hsl(200, 50%, 50%);
  position: fixed;
  box-shadow: 0 2px 15px rgba(71, 120, 120, 0.5);
  transform: translate3d(0, 0, 0);
  transition: 0.35s all ease-out;
  z-index: 999;
  height: 10vh;
}

#tablet-menu {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 0;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.932);
  overflow: hidden;
  transition: 0.65s;
}

.tablet-menu-links {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
}

.tablet-links-list {
  justify-items: center;
  align-items: center;
  flex-direction: column;
  margin-top: 25vh;
}

.tablet-link {
  font-family: "Squada One", cursive;
  color: white;
  font-size: 1.25em;
  margin: 1em;
}

.desktop-link {
  font-family: "Squada One", cursive;
  color: white;
  margin: 0.05em;
  width: 100%;
  height: 100%;
  font-size: 2.5em;
}
.desktop-link:hover {
    background-color: rgba(0, 0, 0, 0.041);
}


.btn-close {
  margin-top: 10vh;
  font-size: 2.5em;
  color: white;
  border: 1px solid white;
  border-radius: 100%;
}

.loginIcon {
  font-size: 1rem;
  padding-top: 0 !important;
  height: 30px;
}

a {
  font-size: 2rem;
  margin-left: 0.3vw;
  margin-right: 0.3vw;
}

li {
  list-style: none;
}

.sign-out:hover {
  cursor: pointer;
}

.user {
  font-size: 2.5rem;
}

.user:hover {
  text-shadow: 0 0 20px white;
  background-image: white;
  color: #01579b !important;
  z-index: 1;
}

.sign-out {
  font-size: 0.85em;
}

.account {
  font-size: 1em;
}

@media only screen and (max-width: 1024px) {
  .header.hidden-header {
    transform: translate3d(0, -100%, 0);
  }

  .tablet-links-list {
    margin-top: 5vh;
  }

  h1 {
    font-size: 2rem;
  }

  .user {
    font-size: 2rem;
  }
}
</style>
