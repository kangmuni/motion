export class PageComponent {
  // 페이지에 대한 부모 컨테이너에 대한 요소들이 들어 가 있다.
  private element: HTMLUListElement;
  constructor() {
    this.element = document.createElement("ul");
    this.element.setAttribute("class", "page");
    this.element.textContent = "This is PageComponent";
  }
  // 필요한곳에다가 이 페이지를 추가할수 있는것을 만든다.
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }
}
