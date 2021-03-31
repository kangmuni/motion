// BaseComponent 여기저기 쓰는것보다 인터페이스를 규격해서 간편하게 사용하자!

export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
  attach(component: Component, position?: InsertPosition): void;
}

// @_@ HTML element creation 캡슐화하기 @_@

export class BaseComponent<T extends HTMLElement> implements Component {
  // 제네릭 : HTML를 상속하는 서브클래스만 가능하다
  protected readonly element: T; // 요소를 만들면 요소안의 상태들은 변경이 가능하지만 요소자체를 다른것으로 변경하는것은 불가능
  constructor(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild! as T;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
    // insertAdjacentElement 부모 자식안에 요소를 추가 할 수 있음 + command 누르고 마우스 클릭해서 파일들 읽어보는 연습하기!
  }
  removeFrom(parent: HTMLElement) {
    if (parent !== this.element.parentElement) {
      throw new Error('Parent mismatch!');
    }
    parent.removeChild(this.element);
  }
  attach(component: Component, position: InsertPosition = 'afterbegin') {
    component.attachTo(this.element, position);
  }
}
