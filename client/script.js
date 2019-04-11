let serverURL = `http://localhost:3000`

function notif(type, msg) {
    swal(msg, "", type)
}

let app = new Vue({
    el: '#app',
    data: {
        islogin: false,
        emailInput: '',
        passwordInput: '',
        randomJoke: '',
        favoriteJokes: [],
        userInfo: {}
    },
    created() {
        if (!localStorage.getItem('access_token')) {
            this.islogin = false
        } else {
            this.verifyUser()
        }
    },
    methods: {
        verifyUser() {
            axios
                .get(`${serverURL}/verify`, {
                    headers: {
                        access_token: localStorage.getItem('access_token'),
                        check: "true"
                    }
                })
                .then(verified => {
                    this.getRandomJoke()
                    this.getUserInfo()
                    this.islogin = true
                })
                .catch(err => {
                    notif("error", err.response.data.msg)
                    localStorage.clear()
                    this.islogin = false
                })
        },
        login() {
            axios
                .post(`${serverURL}/login`, {
                    email: this.emailInput,
                    password: this.passwordInput
                })
                .then(loggedin => {
                    this.emailInput = ''
                    this.passwordInput = ''
                    notif("success", "login success")
                    localStorage.setItem('access_token', loggedin.data.access_token)
                    this.getRandomJoke()
                    this.getUserInfo()
                    this.islogin = true
                })
                .catch(err => {
                    notif('error', err.response.data.msg)
                })
        },
        logout() {
            localStorage.clear()
            this.islogin = false
        },
        getRandomJoke() {
            axios
                .get(`${serverURL}/randomJoke`)
                .then(joke => {
                    this.randomJoke = joke.data.joke
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getUserInfo() {
            axios
                .get(`${serverURL}/user`, {
                    headers: {
                        access_token: localStorage.getItem("access_token")
                    }
                })
                .then(userData => {
                    this.userInfo = userData.data
                    this.favoriteJokes = userData.data.jokeList
                })
                .catch(err => {
                    console.log(err.response.data.msg)
                    console.log(err)
                })
        },
        addFavorite() {
            axios
                .post(`${serverURL}/favorites`, {
                    joke: this.randomJoke
                }, {
                        headers: {
                            access_token: localStorage.getItem('access_token')
                        }
                    })
                .then(newFavorite => {
                    notif("success", "added new joke to your favourite list!")
                    this.favoriteJokes.push(newFavorite.data)
                    this.getRandomJoke()
                })
                .catch(err => {
                    notif("error", err.response.data.msg)
                    localStorage.clear()
                    this.islogin = false
                })
        },
        deleteFavorite(id) {
            axios
                .delete(`${serverURL}/favorites/${id}`, {
                    headers: {
                        access_token: localStorage.getItem('access_token')
                    }
                })
                .then(deleted => {
                    this.getUserInfo()
                    notif("success", "deleted joke from  your favourite list!")
                })
                .catch(err => {
                    notif("error", err.response.data.msg)
                    localStorage.clear()
                    this.islogin = false
                })
        }

    }
})
