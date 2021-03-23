import { BaseComponent, Component } from "./../component.js";

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

interface SectionContainer extends Component, Composable {
  // 무조건 컴포넌트와 컴퍼저블 인터페이스를 구현해야하고
  setOnCloseListener(listener: OnCloseListener): void; // 클로즈버튼이 가능한 추가적인 API가 있어야함
} // ***규격사항을 정확하게 만들어둔다***

type SectionContainerConstructor = {
  new (): SectionContainer; // 생성자를 정의하는 타입!
  // 생성자를 만들면 SectionContainer를 따르는 그 어떤 타입이라도 괜찮다.
  // 생성자는 아무것도 받지 않는 생성자인데 생성자가 호출이 되면 SectionContainer 라는 인터페이스 규격을 따라가는 그 어떤 클래스라도 이 타입에 맞게되는것이다.
};

// 궁극적인 이유 : 우리가 나중에 다른 타입의 PageItemCompnent를 만들게 되면 다크모드 라던지 이런것들을 확장해서 사용이 가능하다. (나 진짜 머리 깨진다..)
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer {
  // Composable => SectionContainer으로 바뀜!
  private closeListener?: OnCloseListener;
  constructor() {
    super(`<li class="page-item">
            <section class="page-item-body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
    const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
  }
  addChild(child: Component) {
    // 외부에서 받아 올 자식
    const container = this.element.querySelector(
      ".page-item-body"
    )! as HTMLElement;
    child.attachTo(container);
  }
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
}

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable {
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    // 원래 비어있던 생성자에 전달받을것이 생겼다!
    // PageComponent는 정해진 어떤 특정한 클래스를 만드는것이 아니라 생성자로 전달된 타입의 아이를 생성하게 된다. (외부에서 받아올것이다)
    super('<ul class="page"></ul>');
  }
  addChild(section: Component) {
    // const item = new PageItemComponent(); // 내부에서가 한가지 클래스만 만드는것은 나쁜냄새가난다.
    const item = new this.pageItemConstructor(); // 외부에서 전달된 pageItemConstructor 통해 만들 수 있게 되었다.
    item.addChild(section);
    item.attachTo(this.element, "beforeend"); // 만든 페이지 아이템을 현재 페이지 마지막에 붙이기!
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
    });
  }
}
