<!-- frontend/pages/index.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
    <h1 class="text-3xl font-bold text-gray-800">App template running</h1>
    <p class="text-gray-500 text-sm">
      API status:
      <span :class="healthy ? 'text-green-600' : 'text-red-500'" class="font-semibold">
        {{ healthy === null ? 'checking...' : healthy ? 'reachable ✓' : 'unreachable ✗' }}
      </span>
    </p>
  </div>
</template>

<script setup>
const { get } = useApi()
const healthy = ref(null)

onMounted(async () => {
  try {
    const data = await get('/health')
    healthy.value = data?.status === 'ok'
  } catch {
    healthy.value = false
  }
})
</script>
