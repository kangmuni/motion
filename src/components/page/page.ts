export class PageComponent {
  // 페이지에 대한 부모 컨테이너에 대한 요소들이 들어 가 있다.
  private element: HTMLUListElement;
  constructor() {
    this.element = document.createElement("ul");
    this.element.setAttribute("class", "page");
    this.element.textContent = "This is PageComponent";
  }
  // 필요한곳에다가 이 페이지를 추가 할 수 있는 외부에서 사용할 수 있는 API를 만든다.
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
    // insertAdjacentElement 부모 자식안에 요소를 추가 할 수 있음 + command 누르고 마우스 클릭해서 파일들 읽어보는 연습하기!
  }
}
