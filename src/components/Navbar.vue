<template>
    <nav>
        <v-app-bar flat app color="c400 c100--text">
            <v-toolbar-title>
                <v-img 
                    height="31"
                    :src="logo"
                    aspect-ratio="1"
                ></v-img>
            </v-toolbar-title>

        </v-app-bar>
    </nav>
</template>

<script>

export default {
    name: 'Navbar',
    components: {
       
    },
    data(){
        return {
            logo: require('@/assets/logo.svg')
        }
    }
}
</script>