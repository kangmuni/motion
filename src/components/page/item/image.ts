export class ImageComponent {
  private element: HTMLElement;
  constructor(title: string, url: string) {
    const template = document.createElement("template");
    template.innerHTML = `<section class="image">
        <div class="image__holder"><img class="image__thumbnail" /></div>
        <p class="image__title"></p>
      </section>`;
    // 위 코드에서 리터럴로 추가할 수 있지만 그렇게 사용하는것은 위험한 방법이다.
    // 아래 코드처럼 따로 불러와서 하나하나 설정 입력해서 만들어주어야 안전하다.
    this.element = template.content.firstElementChild! as HTMLElement; // null이 아니다! HTML요소이다!

    const imageElement = this.element.querySelector(
      ".image__thumbnail"
    )! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;

    const titleElement = this.element.querySelector(
      ".image__title"
    )! as HTMLParagraphElement;
    titleElement.textContent = title;
  }
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }
}
