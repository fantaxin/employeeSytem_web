<template>
  <div>
    <Header/>
    <div style="display: flex">
      <Aside/>
      <router-view style="flex: 1"></router-view>
    </div>

  </div>

</template>

<script>
import Header from "@/components/Header";
import Aside from "@/components/Aside";
export default {
  name: "layout",
  components: {
    Aside,
    Header,
  }
};
</script>
