import { BaseComponent, Component } from './../component.js';

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave';
type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;

interface SectionContainer extends Component, Composable {
  // 무조건 컴포넌트와 컴퍼저블 인터페이스를 구현해야하고
  setOnCloseListener(listener: OnCloseListener): void; // 클로즈버튼이 가능한 추가적인 API가 있어야함
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoundingRect(): ClientRect;
  onDropped(): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer; // 생성자를 정의하는 타입!
  // 생성자를 만들면 SectionContainer를 따르는 그 어떤 타입이라도 괜찮다.
  // 생성자는 아무것도 받지 않는 생성자인데 생성자가 호출이 되면 SectionContainer 라는 인터페이스 규격을 따라가는 그 어떤 클래스라도 이 타입에 맞게되는것이다.
};

// 궁극적인 이유 : 우리가 나중에 다른 타입의 PageItemCompnent를(다크모드라던지..) 만들게 되면 확장이 가능하고 유연한 컴포넌트가 가능하게 되는것이다. (나 진짜 머리 깨진다..)
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer {
  // Composable => SectionContainer으로 바뀜!
  private closeListener?: OnCloseListener;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;
  constructor() {
    super(`<li class="page-item" draggable="true">
            <section class="page-item-body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
    this.element.addEventListener('dragstart', (event: DragEvent) => {
      this.onDragStart(event);
    });
    this.element.addEventListener('dragend', (event: DragEvent) => {
      this.onDragEnd(event);
    });
    this.element.addEventListener('dragenter', (event: DragEvent) => {
      this.onDragEnter(event);
    });
    this.element.addEventListener('dragleave', (event: DragEvent) => {
      this.onDragLeave(event);
    });
  }

  onDragStart(_: DragEvent) {
    this.notifyDragObserver('start');
    this.element.classList.add('drag-started');
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObserver('stop');
    this.element.classList.remove('drag-started');
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObserver('enter');
    this.element.classList.add('drop-zone');
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObserver('leave');
    this.element.classList.remove('drop-zone');
  }

  onDropped() {
    this.element.classList.remove('drop-zone');
  }

  notifyDragObserver(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }

  addChild(child: Component) {
    // 외부에서 받아 올 자식
    const container = this.element.querySelector(
      '.page-item-body'
    )! as HTMLElement;
    child.attachTo(container);
  }
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }

  muteChildren(state: 'mute' | 'unmute') {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }

  getBoundingRect(): ClientRect {
    return this.element.getBoundingClientRect();
  }
}

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable {
  private children = new Set<SectionContainer>(); // 모든 자식 섹션컨테이너를 가진다.
  // map에는 중복되는 데이터를 가질 수 있지만,
  // Set이라는 키워드는 중복되는 데이터를 가질 수 없는 자료구조다?
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;

  constructor(private pageItemConstructor: SectionContainerConstructor) {
    // 원래 비어있던 생성자에 전달받을것이 생겼다!
    // PageComponent는 정해진 어떤 특정한 클래스를 만드는것이 아니라 생성자로 전달된 타입의 아이를 생성하게 된다. (외부에서 받아올것이다)
    super('<ul class="page"></ul>');
    this.element.addEventListener('dragover', (event: DragEvent) => {
      this.onDragOver(event);
    });
    this.element.addEventListener('drop', (event: DragEvent) => {
      this.onDrop(event);
    });
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log('onDragOver');
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    console.log('onDrop');
    // 여기에서 위치를 바꿔준다?
    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();

      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.top ? 'beforebegin' : 'afterend'
      );
    }
    this.dropTarget.onDropped();
  }
  // drop zone을 정의할때는 이벤트에 preventDefault 호출을 해줘야한다. 안그러면 브라우저에서 기본적으로 처리하는 터치, 포인터 이벤트에서 안좋은 상황이 발생할 수 있다.
  // 사실 이렇게 강요받는것은 나쁜 API이다. 그래서 버그도 많고 까다롭고 깨끗하지 않아서 많은 사람들이 좋아하지 않는다고한다.
  // 하지만 구현해보자!

  addChild(section: Component) {
    // const item = new PageItemComponent(); // 내부에서가 한가지 클래스만 만드는것은 나쁜냄새가난다.
    const item = new this.pageItemConstructor(); // 외부에서 전달된 pageItemConstructor 통해 만들 수 있게 되었다.
    item.addChild(section);
    item.attachTo(this.element, 'beforeend'); // 만든 페이지 아이템을 현재 페이지 마지막에 붙이기!
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        console.log(target, state);
        switch (state) {
          case 'start':
            this.dragTarget = target;
            this.updateSections('mute');
            break;
          case 'stop':
            this.dragTarget = undefined;
            this.updateSections('unmute');
            break;
          case 'enter':
            //console.log("enter", target);
            this.dropTarget = target;
            break;
          case 'leave':
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
      }
    );
  }

  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
