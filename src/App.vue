<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  font-family: 'Heiti SC', '苹方-简', '常规', 'Helvetica Neue';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  background: #F4F7FE;
}
ul,li,a {
  list-style: none;
  margin: 0;
  padding: 0;
}
input {
  border: none;
  outline: none;
}
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
    -moz-appearance: textfield;
}
.el-pagination {
    color: #999;
    font-size: 16px;
}
#empty {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    font-size: 12px;
    color: #A5A5A5;
    display: inherit;
  }
#empty img {
    width: 100px;
}
#pagination {
  padding: 10px 0;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
}
</style>
