import { ApplicationRef, ComponentRef, Injectable, createComponent, EnvironmentInjector } from '@angular/core';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fullpage-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fullpage-loader.html',
})
export class FullPageLoaderComponent {
  @Input() loading = false;
}

@Injectable({
  providedIn: 'root'
})
export class FullPageLoader {
  private loaderRef?: ComponentRef<FullPageLoaderComponent>;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open() {
    if (this.loaderRef) return; // already open

    const loader = createComponent(FullPageLoaderComponent, {
      environmentInjector: this.injector
    });

    loader.instance.loading = true;
    this.appRef.attachView(loader.hostView);

    const domElem = (loader.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.loaderRef = loader;
  }

  close() {
    if (!this.loaderRef) return;

    this.loaderRef.instance.loading = false;
    this.appRef.detachView(this.loaderRef.hostView);
    this.loaderRef.destroy();
    this.loaderRef = undefined;
  }
}