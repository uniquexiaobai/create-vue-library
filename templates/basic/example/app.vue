<template>
  <div>
    <p>hello I am parcel vue</p>
    <MyComp />
    <MyComp2 />
  </div>
</template>

<script>
import { MyComp } from "../.";
import { MyComp2 } from "../.";
export default {
  name: "App",
  components: {
    MyComp,
    MyComp2
  },
  mounted() {
    console.log("mounted");
  }
};
</script>

<style scoped>
p {
  color: red;
}
</style>