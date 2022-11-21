const tpl = document.createElement("template");
tpl.innerHTML = `
<style>
:host {
  display: block;
  text-align: center;
}
.imgs {
  overflow: hidden;
}
::slotted(img) {
  max-width: 100%;
}
.controls {
  margin-bottom: 1rem;
}

</style>
<slot name="title"></slot>
<div class="controls">
  <span id="current">Photo 1 of 5</span>
  <button id="prev">Previous</button>
  <button id="next">Next</button>
</div>
<div class="imgs">
  <slot id="imgs"></slot>
</div>
`;

class ImgGalleryElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(tpl.content.cloneNode(true));

    let selectedIdx = 0;
    Object.defineProperty(this, "selectedIdx", {
      get: () => selectedIdx,
      set: (value) => {
        const imgs = imgsEl.assignedNodes().filter(isImg);
        selectedIdx = fixIndex(value, imgs.length);
        updateUi();
      },
    });

    const imgsEl = this.shadowRoot.getElementById("imgs");
    const prevEl = this.shadowRoot.getElementById("prev");
    const nextEl = this.shadowRoot.getElementById("next");
    const currentEl = this.shadowRoot.getElementById("current");

    const updateUi = () => {
      const imgs = imgsEl.assignedNodes().filter(isImg);
      currentEl.textContent = `Photo ${selectedIdx + 1} of ${imgs.length}`;
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        img.style.display = selectedIdx === i ? "initial" : "none";
      }
      prevEl.disabled = selectedIdx === 0;
      nextEl.disabled = selectedIdx === imgs.length - 1;
    };
    updateUi();

    prevEl.addEventListener("click", () => {
      this.selectedIdx--;
    });

    nextEl.addEventListener("click", () => {
      this.selectedIdx++;
    });

    imgsEl.addEventListener("slotchange", () => {
      this.selectedIdx = this.selectedIdx;
    });
  }
}

function fixIndex(index, length) {
  if (index >= length) {
    return (index = length - 1);
  } else if (index < 0) {
    return 0;
  } else {
    return index;
  }
}

function isImg(e) {
  return e.nodeName === "IMG";
}

customElements.define("img-gallery", ImgGalleryElement);
