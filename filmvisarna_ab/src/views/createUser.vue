<template>
<div class="container col createUser">
    <div class="center-block center-align">
        <h1 class="black">SKAPA <br> KONTO</h1>
        <form action="#" @submit.prevent="submit">
            <div class="input-field">
                <input id="name" type="text" name="name" value required autofocus v-model="form.name" />
                <label for="name">Namn</label>
            </div>

            <div class="input-field">
                <input id="email" type="email" name="email" value required autofocus v-model="form.email" />
                <label for="email">Email</label>
            </div>

            <div class="input-field">
                <input id="password" type="password" name="password" required v-model="form.password" />
                <label for="password">Lösenord</label>
            </div>

            <div class="input-field">
                <button type="submit" class="btn waves-effect waves-light">Skapa konto</button>
            </div>
        </form>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                name: "",
                email: "",
                password: ""
            }
        }
    },
    methods: {
        /* This method registers account and sends it to firebase and redirects webbbrowser to homepage upon button click */
        submit() {
            this.$store.dispatch('registerUser', this.form)
            this.$router.replace({
                name: "homePage"
            });
        }

    }
}
</script>

<style scoped>
.createUser {
    background-color: transparent;
}

h1 {
  font-family: "Squada One", cursive;
    font-size: 3rem
}

button {
    background-color: #01579b;
}
</style>
