import { BaseComponent, Component } from "./../component.js";

export interface Composable {
  addChild(child: Component): void;
}

// 내부에서 만들어주는 컴포넌트!
class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements Composable {
  constructor() {
    super(`<li class="page-item">
            <section class="page-item-body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
  }
  addChild(child: Component) {
    // 외부에서 받아 올 자식
    const container = this.element.querySelector(
      ".page-item-body"
    )! as HTMLElement;
    child.attachTo(container);
  }
}

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable {
  constructor() {
    super('<ul class="page"></ul>');
  }
  addChild(section: Component) {
    const item = new PageItemComponent();
    item.addChild(section);
    item.attachTo(this.element, "beforeend"); // 만든 페이지 아이템을 현재 페이지 마지막에 붙이기!
  }
}
