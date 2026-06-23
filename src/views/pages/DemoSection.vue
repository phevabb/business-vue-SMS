<template>
  <section class="demo-wrapper">
    <div class="demo-card">
      <h2 class="title">See PhenaSMS in Action</h2>
      <p class="subtitle">
        Watch a quick walkthrough or book a live demo with us
      </p>

      <!-- Video -->
      <div class="video-container">
        <video class="video" controls>
          <source src="/public/videos/demo.mp4" type="video/mp4" />
          Your browser does not support video.
        </video>
      </div>

      <!-- CTA -->
      <div class="cta">
        <button @click="openCalendly" class="btn-primary">
          📅 Book Free Demo
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const openCalendly = () => {
  window.open("https://calendly.com/your-link", "_blank")
}
</script>

<style scoped>
.demo-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  padding: 20px;
}

.demo-card {
  background: white;
  border-radius: 18px;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 20px;
}

.video-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.video {
  width: 100%;
  height: auto;
  display: block;
}

.cta {
  margin-top: 25px;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  border: none;
  padding: 12px 22px;
  font-size: 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(79,70,229,0.3);
}
</style>
