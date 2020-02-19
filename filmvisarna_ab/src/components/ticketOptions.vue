<template>
<div class="main container">
    <div class="row options">
        <p class="screeningInfo col s6 m6 l6 xl6">{{ screening.film }}</p>
        <p class="screeningInfo col s6 m6 l6 xl6 right-align">
            Platser kvar: {{ screening.seatsAvailable }}
        </p>
        <p class="timeOfScreening col s6 m6 l6 xl6">
            {{ getScreeningTime(screening.time) }}
        </p>
        <p class="dayOfScreening col s6 m6 l6 xl6 right-align">
            {{ getDateAsString(screening.time) }}
        </p>
    </div>
    <div class="row">
        <div class="ticketInfo col s6">
            <p>Ordinarie</p>
            <p>85kr / st</p>
        </div>
        <div class="col s6 ticketOption container">
            <button class="btn-small blue darken-3" @click="deductRegularTicket()">
                -
            </button>
            <p class="ticketAmount">{{ this.numberOfRegularTickets }}</p>
            <button class="btn-small blue darken-3" @click="addRegularTicket()">
                +
            </button>
        </div>
    </div>
    <div class="row">
        <div class="ticketInfo col s6">
            <p>Barn under 12år</p>
            <p>65kr / st</p>
        </div>
        <div class="col s6 ticketOption container">
            <button class="btn-small blue darken-3" @click="deductChildTicket()">
                -
            </button>
            <p class="ticketAmount">{{ this.numberOfChildTickets }}</p>
            <button class="btn-small blue darken-3" @click="addChildTicket">
                +
            </button>
        </div>
    </div>
    <div class="row">
        <div class="ticketInfo col s6">
            <p>Pensionär</p>
            <p>75kr / st</p>
        </div>
        <div class="col s6 ticketOption container">
            <button class="btn-small blue darken-3" @click="deductSeniorCitizenTicket()">
                -
            </button>
            <p class="ticketAmount">{{ this.numberSeniorCitizenTickets }}</p>
            <button class="btn-small blue darken-3" @click="addSeniorCitizenTicket()">
                +
            </button>
        </div>
    </div>
    <div class="row checkOut">
        <div class="col container s12">
            <p class="red-text center" v-if="this.numberOfRegularTickets <= 0 &&
        this.numberOfChildTickets <= 0 &&
        this.numberSeniorCitizenTickets <= 0">
                Du måste välja minst 1 biljett
            </p>
            <button @click="showAuditorium(screening)" class="btn-large blue darken-3" v-if="displayBookingButton">
                Välj platser
            </button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            numberOfRegularTickets: 2,
            numberSeniorCitizenTickets: 0,
            numberOfChildTickets: 0,
            totalPriceForPurchase: 170,
            accountEmail: ""
        };
    },
    computed: {
        screening() {
            let screenings = this.$store.state.screenings;
            let movieScreening;
            for (let screening of screenings) {
                if (screening.id === this.$route.params.screening) {
                    movieScreening = screening;
                }
            }
            return movieScreening;
        },
        user() {
            return this.$store.state.user
        },
        displayBookingButton() {
            return (this.numberOfRegularTickets + this.numberOfChildTickets + this.numberSeniorCitizenTickets) > 0
        }
    },
    created() {
        this.$store.dispatch("getMovies");
    },
    methods: {
        showAuditorium(screening) {
            let numberOfTickets = {
                numberOfRegularTickets: this.numberOfRegularTickets,
                numberOfChildTickets: this.numberOfChildTickets,
                numberSeniorCitizenTickets: this.numberSeniorCitizenTickets
            }
            this.$store.commit('setNumberOfTickets', numberOfTickets)

            let seatsLeft = screening.seatsAvailable -
                (this.numberOfRegularTickets +
                    this.numberOfChildTickets +
                    this.numberSeniorCitizenTickets);

            this.$store.commit('setBooking', {
                childTickets: this.numberOfChildTickets,
                customerBookingReferenceNumber: this.generateCustomerBookingReferenceNumber(),
                regularTickets: this.numberOfRegularTickets,
                screeningDate: this.getDateAsString(screening.time),
                screeningID: screening.id,
                screeningTime: this.getScreeningTime(screening.time),
                screeningTitle: screening.film,
                seniorCitizenTickets: this.numberSeniorCitizenTickets,
                totalPriceForPurchase: this.totalPriceForPurchase,
                seatsLeft: seatsLeft,
                screeningTimeStamp: screening.time
            })
            this.$emit('toAuditorium')
        },
        seatsAvailable() {
            if (
                this.screening.seatsAvailable >
                this.numberOfRegularTickets +
                this.numberOfChildTickets +
                this.numberSeniorCitizenTickets
            ) {
                return true;
            }
        },
        addRegularTicket() {
            if (this.seatsAvailable()) {
                this.numberOfRegularTickets++;
                this.totalPriceForPurchase += 85;
            }
        },
        deductRegularTicket() {
            if (this.numberOfRegularTickets != 0) {
                this.numberOfRegularTickets--;
                this.totalPriceForPurchase -= 85;
            }
        },
        addSeniorCitizenTicket() {
            if (this.seatsAvailable()) {
                this.numberSeniorCitizenTickets++;
                this.totalPriceForPurchase += 75;
            }
        },
        deductSeniorCitizenTicket() {
            if (this.numberSeniorCitizenTickets != 0) {
                this.numberSeniorCitizenTickets--;
                this.totalPriceForPurchase -= 75;
            }
        },
        addChildTicket() {
            if (this.seatsAvailable()) {
                this.numberOfChildTickets++;
                this.totalPriceForPurchase += 65;
            }
        },
        deductChildTicket() {
            if (this.numberOfChildTickets != 0) {
                this.numberOfChildTickets--;
                this.totalPriceForPurchase -= 65;
            }
        },
        generateCustomerBookingReferenceNumber() {
            return (
                Math.random()
                .toString(36)
                .substr(2, 5)
            );
        },
        getScreeningTime(screeningDate) {
            let screeningTime = `${screeningDate.getHours()}:${this.getMinutesAsString(screeningDate.getMinutes())}`;
            return screeningTime;
        },
        getDateAsString(date) {
            return `${date.getDate()} ${this.getMonthName(date.getMonth())} ${date.getFullYear()}`
        },
        getMonthName(monthNumber) {
            let months = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
            return months[monthNumber];
        },
        getMinutesAsString(minuteNumber) {
            if (minuteNumber < 10) {
                return "0" + minuteNumber;
            }
            return minuteNumber;
        },
        getHoursAsString(hourNumber) {
            if (hourNumber < 10) {
                return "0" + hourNumber;
            }
            return hourNumber;
        }
    }
};
</script>

<style scoped>
.main {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.ticketOption {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.warning {
    font-size: 1.25em;
    color: red;
}

.options {
    margin-top: 10%;
}

.checkOut {
    margin-top: 30%;
}

@media screen and (min-width: 768px) {
    .main {
        margin-top: 5%;
        width: 50%;
        font-size: 1.5em;
    }

    .btn-small {
        height: 5vh;
        width: 2.5vw;
    }
}
</style>
