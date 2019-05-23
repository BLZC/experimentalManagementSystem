<template>
  <div id="app" @click="clicked">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
    data (){
        return {
            lTime: new Date().getTime(), // 最后一次点击的时间
            ctTime: new Date().getTime(), //当前时间
            tOut: 60 * 1000,   //超时时间10min
        } 
    },
    mounted () {
        window.setInterval(this.tTime, 1000)
    },
 
    methods:{
        clicked () {
            this.lTime = new Date().getTime()  //当界面被点击更新点击时间
        },
 
        tTime() {
            this.cTime = new Date().getTime()
            if (this.ctTime -this.lTime > this.tOut) {
                if(JSON.parse(sessionStorage.getItem('Login')) === true){
                    // 退出登录
                    alert("登录超时，请重新登录！");
                   	this.$router.push({ path: "/login" });
                }
            }
        }
    }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

