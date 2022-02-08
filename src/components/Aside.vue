<template>
  <el-menu
      style="width: 200px; min-height: calc(100vh - 50px)"
      default-active="/"
      class="el-menu-vertical-demo"
      router>
    <el-menu-item index="/">
      <span>员工管理</span>
    </el-menu-item>
    <el-menu-item index="department">
      <span>部门管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Aside"
}
</script>

<style scoped>

</style>