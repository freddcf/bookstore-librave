<template>
    <nav>
        <v-app-bar flat app color="c400 c100--text">
            <v-app-bar-title>
                <v-img 
                    height="31"
                    :src="logo"
                ></v-img>
            </v-app-bar-title>
            <v-spacer></v-spacer>
            
            <v-btn 
                v-for="link in links" 
                :key="link.title" 
                :to="link.path"
                depressed
                class="transparent c000--text"
                >
                <v-icon>
                    {{ link.icon }}
                </v-icon>

                {{ link.title }}
            </v-btn>

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
            logo: require('@/assets/logo.svg'),
            links: [
                {title: 'home', icon: 'mdi-home', path: '/'},
                {title: 'usuário', icon: 'mdi-account', path: '/user'},
                {title: 'editora', icon: 'mdi-bookshelf', path: '/publisher'},
                {title: 'livro', icon: 'mdi-book-plus', path: '/book'},
                {title: 'aluguel', icon: 'mdi-bookmark-box-multiple-outline', path: '/rental'},
            ]
        }
    }
}
</script>