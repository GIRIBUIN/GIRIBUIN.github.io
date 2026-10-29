// Also upgrades players inserted by the React Details window, without executing fetched scripts.
if (typeof customElements !== 'undefined' && !customElements.get('youtube-player')) {
  customElements.define('youtube-player', class extends HTMLElement {
    connectedCallback() { this.addEventListener('click', this.play); }
    disconnectedCallback() { this.removeEventListener('click', this.play); }
    play = (event: Event) => {
      if (!(event.target instanceof Element) || !event.target.closest('button') || !this.dataset.src || this.querySelector('iframe')) return;
      const frame = document.createElement('iframe');
      frame.src = this.dataset.src + '&autoplay=1';
      frame.title = this.dataset.title || 'YouTube';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      this.replaceChildren(frame);
      frame.focus();
    };
  });
}
