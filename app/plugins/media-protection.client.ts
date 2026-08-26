export default defineNuxtPlugin((nuxtApp) => {
  const protectMedia = (root: ParentNode = document) => {
    root.querySelectorAll<HTMLImageElement | HTMLVideoElement>('img, video').forEach((media) => {
      media.draggable = false
    })
  }

  const mediaFromEvent = (event: Event) => {
    const target = event.target
    return target instanceof Element ? target.closest('img, video') : null
  }

  const preventMediaAction = (event: Event) => {
    if (mediaFromEvent(event)) event.preventDefault()
  }

  protectMedia()
  nuxtApp.hook('page:finish', () => protectMedia())

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement) node.draggable = false
        else if (node instanceof Element) protectMedia(node)
      })
    })
  })

  observer.observe(document.documentElement, { childList: true, subtree: true })
  document.addEventListener('dragstart', preventMediaAction, true)
  document.addEventListener('contextmenu', preventMediaAction, true)

  nuxtApp.hook('app:beforeMount', () => protectMedia())
  nuxtApp.hook('app:error', () => protectMedia())

  window.addEventListener('pagehide', () => {
    observer.disconnect()
    document.removeEventListener('dragstart', preventMediaAction, true)
    document.removeEventListener('contextmenu', preventMediaAction, true)
  }, { once: true })
})
