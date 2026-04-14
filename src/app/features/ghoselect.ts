import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { tags, ghoresult } from '../model/ghomodel';
import { GHOService } from '../services/ghosrvs';

import { Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SelectOption {
    value: string;
    label: string;
}


@Component({
    selector: 'gho-select',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="select-container">
  <button type="button" class="select-trigger" (click)="toggleDropdown()">
    {{ selectedLabel() }}
  </button>

  @if (isOpen()) {

    <div popover> 
    <ul class="options-list">
      @for (option of options; track option.value) {
        <li
          (click)="selectOption(option)"
          [class.selected]="selectedValue()?.value === option.value"
        >
          {{ option.label }}
        </li>
      }
    </ul></div> 
  }
</div>
    
        `,
    styles: [
        `
     select-container {
  position: relative;
  width: 200px;
}

.select-trigger {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.options-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: white;
  z-index: 999999;
}

.options-list li {
  padding: 10px;
  cursor: pointer;
}

.options-list li:hover,
.options-list li.selected {
  background-color: #f0f0f0;
}
    `,
    ],
})
export class GHOSelect {
    @Input() options: SelectOption[] = [];
    @Input() placeholder: string = 'Select an option';
    @Output() selectionChange = new EventEmitter<SelectOption>();

    isOpen = signal(false);
    selectedValue = signal<SelectOption | null>(null);

    // Computed property to display the selected label or placeholder
    selectedLabel = computed(() => this.selectedValue()?.label || this.placeholder);

    toggleDropdown(): void {
        this.isOpen.set(!this.isOpen());
    }

    selectOption(option: SelectOption): void {
        this.selectedValue.set(option);
        this.selectionChange.emit(option);
        this.isOpen.set(false); // Close the dropdown on selection
    }
}