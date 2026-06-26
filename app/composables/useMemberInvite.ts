export function useMemberInvite() {
  const state = useState('member-invite', () => ({
    isOpen: false,
  }))

  const refreshKey = useState('member-invite-refresh', () => 0)

  function open() {
    state.value.isOpen = true
  }

  function close() {
    state.value.isOpen = false
  }

  function notifyCreated() {
    refreshKey.value++
  }

  return {
    state: readonly(state),
    refreshKey: readonly(refreshKey),
    open,
    close,
    notifyCreated,
  }
}
