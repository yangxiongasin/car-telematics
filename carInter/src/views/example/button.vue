<template>
  <div>
    <p>颜色</p>
    <div class="btn-wrap">
      <m-button type="default">default</m-button>
      <m-button type="primary">primary</m-button>
      <m-button type="success">success</m-button>
      <m-button type="error">error</m-button>
      <m-button type="warn">warn</m-button>
      <m-button type="info">info</m-button>
    </div>
    <p>尺寸</p>
    <div class="btn-wrap">
      <m-button size="small">small</m-button>
      <m-button size="large">large</m-button>
      <m-button>normal</m-button>
    </div>
    <p>禁用</p>
    <div class="btn-wrap">
      <m-button type="default" disabled>default</m-button>
      <m-button type="primary" disabled>primary</m-button>
      <m-button type="success" disabled>success</m-button>
      <m-button type="error" disabled>error</m-button>
      <m-button type="warn" disabled>warn</m-button>
      <m-button type="info" disabled>info</m-button>
    </div>
    <p>幽灵按钮</p>
    <div class="btn-wrap">
      <m-button type="default" plain>default</m-button>
      <m-button type="primary" plain>primary</m-button>
      <m-button type="success" plain>success</m-button>
      <m-button type="error" plain>error</m-button>
      <m-button type="warn" plain>warn</m-button>
      <m-button type="info" plain>info</m-button>
    </div>
    <p>带图标</p>
    <div class="btn-wrap">
      <m-button type="default" plain icon="loading">default</m-button>
      <m-button type="primary" icon="loading">primary</m-button>
    </div>
    <p>自定义图标</p>
    <div class="btn-wrap">
      <m-button>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="" style="width:20px;margin-right:5px;" slot="icon">
        自定义图标
      </m-button>
    </div>
    <p>自定义图标</p>
    <div class="btn-wrap">
      <m-button @click="handleClick">
        click事件
      </m-button>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {  // store data
      return {}
    },
    props: { // props data

    },
    methods: { // methods
      handleClick () {
        alert('click')
      }
    }
  }
</script>

<style scoped>
  .btn-wrap {
    padding: 0 10px 10px 10px;
  }
</style>
