import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useDropdownCloser(
  wrappers: Record<string, Ref<HTMLElement | null>>,
  activeKey: Ref<string | null>,
) {
  function onClick(event: MouseEvent) {
    if (!activeKey.value) return
    const wrapper = wrappers[activeKey.value]
    if (!wrapper?.value) return
    if (!wrapper.value.contains(event.target as Node)) {
      activeKey.value = null
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      activeKey.value = null
    }
  }

  onMounted(() => {
    window.addEventListener('click', onClick)
    window.addEventListener('keydown', onKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('click', onClick)
    window.removeEventListener('keydown', onKeydown)
  })
}
