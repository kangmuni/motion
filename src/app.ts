import { TextSectionInput } from './components/dialog/input/text-input.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import {
  InputDialog,
  TextData,
  MediaData,
} from './components/dialog/dialog.js';
import { Component } from './components/component.js';
import { VideoComponent } from './components/page/item/video.js';
import { TodoComponent } from './components/page/item/todo.js';
import { NoteComponent } from './components/page/item/note.js';
import { ImageComponent } from './components/page/item/image.js';
import {
  Composable,
  PageComponent,
  PageItemComponent,
} from './components/page/page.js';

type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
  new (): T;
};

class App {
  private readonly page: Component & Composable; // 컴포넌트중에 하나이고 컴포저블이라는 인터페이스를 구현한 아이이다!
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    this.bindElementToDialog<MediaSectionInput>(
      '#new-image',
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );

    this.bindElementToDialog<MediaSectionInput>(
      '#new-video',
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );

    this.bindElementToDialog<TextSectionInput>(
      '#new-note',
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    this.bindElementToDialog<TextSectionInput>(
      '#new-todo',
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );
    // For demo
    this.page.addChild(
      new ImageComponent('Image Title', 'https://picsum.photos/600/300')
    );
    this.page.addChild(
      new VideoComponent('Video Title', 'https://youtu.be/nxKfi-6EtmY')
    );
    this.page.addChild(
      new NoteComponent('Note Title', 'Completed OOP to Typescript')
    );
    this.page.addChild(
      new TodoComponent('Todo Title', 'Styling and Dragging option')
    );
    this.page.addChild(
      new ImageComponent('Image Title', 'https://picsum.photos/600/300')
    );
    this.page.addChild(
      new VideoComponent('Video Title', 'https://youtu.be/nxKfi-6EtmY')
    );
    this.page.addChild(
      new NoteComponent('Note Title', 'Completed OOP to Typescript')
    );
    this.page.addChild(
      new TodoComponent('Todo Title', 'Styling and Dragging option')
    );
  }

  private bindElementToDialog<T extends (MediaData | TextData) & Component>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component // MediaSectionInput | TextSectionInput을 인자로 받아서 컴포넌트를 만드는 함수
  ) {
    const element = document.querySelector(selector)! as HTMLButtonElement;
    element.addEventListener('click', () => {
      const dialog = new InputDialog();
      const input = new InputComponent();
      dialog.addChild(input);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const image = makeSection(input);
        this.page.addChild(image);
        dialog.removeFrom(this.dialogRoot);
      });
    });
  }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);
