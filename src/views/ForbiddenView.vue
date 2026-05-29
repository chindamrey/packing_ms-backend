<template>
  <div class="error-page border">
    <h1>403</h1>
    <p>Sorry, you don't have permission to access this page.</p>
    <img src="/images/403.png" alt="403" height="300" class="mb-3" />
    <RouterLink
      :to="{ name: 'dashboard' }"
      class="btn btn-primary d-flex align-items-center gap-2"
    >
      <i class="bi bi-arrow-left"></i> Dashboard</RouterLink
    >
  </div>
</template>


<style scoped>
  .error-page {
    font-family: "Inter";
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }
  .error-page h1 {
    font-size: 6rem;
    margin: 0;
    margin-top: -10px;
    color: #bb4341;
    font-weight: 800;
  }
  .error-page p {
    font-size: 1.2rem;
    font-weight: 650;
  }
</style>