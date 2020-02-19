<template>
<div class="container col">
    <ticketOptions @toAuditorium="displayAuditorium" v-if="showTicketOptions" />
    <auditorium v-if="showAuditorium" @return="displayTicketOptions" @toConfirmation="displayConfirmation" />
    <bookingConfirmation v-if="showConfirmation" />
</div>
</template>

<script>
import auditorium from '@/components/auditorium.vue'
import ticketOptions from "@/components/ticketOptions.vue";
import bookingConfirmation from "@/components/bookingConfirmation.vue";
export default {
    components: {
        auditorium,
        ticketOptions,
        bookingConfirmation
    },
    data() {
        return {
            showConfirmation: false,
            showTicketOptions: true,
            showAuditorium: false,
        };
    },
    methods: {
        displayTicketOptions() {
            this.showTicketOptions = true;
            this.showAuditorium = false;
        },
        displayAuditorium() {
            this.showTicketOptions = false;
            this.showAuditorium = true;
        },
        displayConfirmation() {
            this.showAuditorium = false;
            this.showConfirmation = true;
        },

    },
};
</script>

<style scoped>

</style>
