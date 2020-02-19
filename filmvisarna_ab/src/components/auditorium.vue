<template>
<div ref="auditorium">
    <div class="flow-text headline">Välj {{ numberOfSeats }} platser</div>
    <div class="movie-screen-container">
        <div class="movie-screen"></div>
    </div>
    <div class="row seats" v-for="(row, i) in screening.seats" :key="i">
        <div class="white seat" v-for="(seat, j) in row" :key="seat.x + seat.y + i + j" :class="{
          unavailable: !seat.isAvailable,
          marked: seat.isMarked,
          available: seat.isAvailable,
          doneMarking: numberOfSeats == 0
        }" :style="{
          margin: seatMargin + 'px',
          width: seatSize + 'px',
          height: seatSize + 'px'
        }" @click="updateSeat(seat)"></div>
    </div>
    <div class="row">
        <div class="btn col light-blue darken-4 s5 l2 offset-l3" @click="returnToTicketOptions()">
            Tillbaka
        </div>
        <div class="btn light-blue darken-4 col s5 offset-s2 l2 offset-l2" :class="{
          disabled: numberOfSeats != 0 || !(user.loggedIn || emailIsValid)
        }" @click="bookTickets()">
            Boka
        </div>
    </div>
    <div class="row" v-if="!user.loggedIn">
        <form class="input-field col s12 l6 offset-l3">
            <input type="email" name="email" value required autofocus v-model="userEmail" />
            <label for="email">Email</label>
            <p v-if="!(emailIsValid || user.loggedIn) && numberOfSeats === 0">
                Logga in eller skriv in en giltig e-mail
            </p>
        </form>
    </div>
    <div class="row">
        <p class="col s12 center-align text-flow" v-for="(seat, i) in seatsMarked" :key="seat + i">
            Rad : {{ seat.y + 1 }} Plats: {{ seat.x + 1 }}
        </p>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            seatMargin: 4,
            auditoriumWidth: 0,
            numberOfSeats: 0,
            numberOfSeatsRead: false,
            seatsMarked: [],
            userEmail: ""
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        screening() {
            let screenings = this.$store.state.screenings;
            return screenings.filter(screening => {
                return screening.id === this.$route.params.screening;
            })[0];
        },
        longestRow() {
            let seats = this.screening.seats;
            let length = 0;
            seats.forEach(row => {
                row = Object.values(row);
                if (row.length > length) {
                    length = row.length;
                }
            });
            return length;
        },
        seatSize() {
            let width = this.auditoriumWidth;
            let seatSize;
            if (width > 840) {
                seatSize = 25;
            } else if (width > 621) {
                seatSize = 45;
            } else {
                width -= this.longestRow * this.seatMargin * 2;
                seatSize = width / this.longestRow;
            }
            return seatSize;
        },
        emailIsValid() {
            let regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regEx.test(this.userEmail);
        }
    },
    methods: {
        returnToTicketOptions() {
            this.$emit("return");
            this.removeIsMarkedFromSeats();
        },
        removeIsMarkedFromSeats() {
            this.screening.seats.forEach(row => {
                row = Object.values(row);
                row.forEach(seat => {
                    delete seat.isMarked;
                });
            });
        },
        bookTickets() {
            this.removeIsMarkedFromSeats();
            this.changeSeatAvailability();
            this.updateBooking();
            this.$store.dispatch("publishBooking", this.$store.state.booking);
            this.$emit("toConfirmation");
        },
        changeSeatAvailability() {
            this.screening.seats.forEach(row => {
                row = Object.values(row);
                row.forEach(seat => {
                    this.seatsMarked.forEach(marked => {
                        if (marked.x === seat.x && marked.y === seat.y) {
                            seat.isAvailable = false;
                        }
                    });
                });
            });
        },
        updateBooking() {
            this.$store.commit("updateBooking", {
                bookedSeats: this.seatsMarked,
                auditoriumSeats: this.screening.seats,
                account: this.setEmail()
            });
        },
        setEmail() {
            if (this.user.loggedIn) {
                return this.user.data.email;
            } else {
                return this.userEmail;
            }
        },
        onResizeListener() {
            if (this.$refs.auditorium) {
                this.auditoriumWidth = this.$refs.auditorium.clientWidth;
            }
        },
        updateSeat(seat) {
            if (seat.isAvailable && !seat.isMarked && this.numberOfSeats > 0) {
                this.numberOfSeats--;
                seat.isMarked = !seat.isMarked;
                this.seatsMarked.push(seat);
            } else if (seat.isAvailable && seat.isMarked) {
                this.numberOfSeats++;
                this.removeMarkedSeat(seat);
                seat.isMarked = !seat.isMarked;
            }
        },
        removeMarkedSeat(seatToRemove) {
            this.seatsMarked = this.seatsMarked.filter(seat => {
                return !(seat.x === seatToRemove.x && seat.y === seatToRemove.y);
            });
        },
        getAuditoriumWidth() {
            if (!this.runOnce) {
                this.auditoriumWidth = this.$refs.auditorium.clientWidth;
                this.runOnce = true;
            }
        }
    },
    created() {
        window.addEventListener("resize", this.onResizeListener.bind(this));
    },
    mounted() {
        this.getAuditoriumWidth();
    },
    updated() {
        this.getAuditoriumWidth();
        if (!this.numberOfSeatsRead) {
            let numberOfTickets = this.$store.state.numberOfTickets;
            this.numberOfSeats =
                numberOfTickets.numberOfRegularTickets +
                numberOfTickets.numberOfChildTickets +
                numberOfTickets.numberSeniorCitizenTickets;
            this.numberOfSeatsRead = true;
        }
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.onResizeListener);
    }
};
</script>

<style scoped>
.seat {
    border-radius: 2px 2px 6px 6px;
}

.seats {
    margin: 0;
    display: flex;
    justify-content: center;
    flex-direction: row-reverse;
}

.available {
    background-color: white !important;
    cursor: pointer;
}

.marked {
    background-color: #01579b !important;
}

.marked:hover {
    background-color: #0091ea !important;
}

.unavailable {
    background-color: transparent !important;
    border: 3px solid white;
    cursor: not-allowed;
}

.movie-screen {
    margin-top: 5%;
    margin-bottom: 10%;
    height: 0;
    border-top: 50px solid white;
    border-right: 30px solid transparent;
    border-left: 30px solid transparent;
    width: 100%;
}

.movie-screen-container {
    display: flex;
    justify-content: center;
}

.headline {
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 2.5rem;
}

.doneMarking {
    opacity: 0.7 !important;
}

.btn {
    margin-top: 3%;
    width: 100%;
    font-size: 1rem;
}

.input-field input[type="email"]:focus {
    border-bottom: 1px solid #01579b;
    box-shadow: 0 1px 0 0 #01579b;
}

@media screen and (min-width: 1200px) {
    .movie-screen {
        width: 40%;
        margin-bottom: 3%;
        margin-top: 2%;
    }

    .unavailable {
        border-width: 5px;
    }
}
</style>
