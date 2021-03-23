import { Component } from "./components/component";
import { VideoComponent } from "./components/page/item/video.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { NoteComponent } from "./components/page/item/note.js";
import { ImageComponent } from "./components/page/item/image.js";
import {
  Composable,
  PageComponent,
  PageItemComponent,
} from "./components/page/page.js";

class App {
  private readonly page: Component & Composable; // 컴포넌트중에 하나이고 컴포저블이라는 인터페이스를 구현한 아이이다!
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot);

    const image = new ImageComponent(
      "Image Title",
      "https://picsum.photos/600/300"
    );
    this.page.addChild(image);
    //image.attachTo(appRoot, "beforeend");

    const note = new NoteComponent("Note Title", "Note Body");
    this.page.addChild(note);
    //note.attachTo(appRoot, "beforeend");

    const todo = new TodoComponent("Todo Title", "Todo Item");
    this.page.addChild(todo);
    //todo.attachTo(appRoot, "beforeend");

    const video = new VideoComponent(
      "Video Title",
      "https://www.youtube.com/watch?v=CfPxlb8-ZQ0"
    );
    this.page.addChild(video);
    //video.attachTo(appRoot, "beforeend");
  }
}

new App(document.querySelector(".document")! as HTMLElement); // 정확하게 정해져있는 경우니까.
